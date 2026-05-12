import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { computeShellMetaDescription } from "./src/config/shellMeta";
import { computeSitemapPathnames } from "./src/config/sitemap-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pdfJsRoot = path.dirname(require.resolve("pdfjs-dist/package.json"));
const pdfJsAssetsRoot = path.join(pdfJsRoot, ".");
const pdfJsCmapsDir = path.join(pdfJsAssetsRoot, "cmaps");
const pdfJsStandardFontsDir = path.join(pdfJsAssetsRoot, "standard_fonts");
const pdfJsPublicBase = "/pdfjs";

function copyDirSync(srcDir: string, destDir: string) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(src, dest);
    } else if (entry.isFile()) {
      fs.copyFileSync(src, dest);
    }
  }
}

function deployPathPrefix(baseUrl: string): string {
  if (!baseUrl || baseUrl === "/") return "";
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function joinPublicUrl(site: string, basePrefix: string, pathname: string): string {
  const s = site.replace(/\/+$/, "");
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${s}${basePrefix}${p}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function injectSiteNameInHtmlPlugin(env: Record<string, string>): Plugin {
  return {
    name: "inject-site-name-index-html",
    transformIndexHtml(html) {
      const name = (env.VITE_SITE_NAME ?? "").trim();
      const titleSuffix = name ? ` | ${escapeXml(name)}` : "";
      const metaDescription = computeShellMetaDescription(name, env);
      return html
        .replace("<!--HTML_SITE_TITLE_SUFFIX-->", titleSuffix)
        .replace(
          "<!--HTML_SITE_META_DESCRIPTION-->",
          escapeXml(metaDescription),
        );
    },
  };
}

function seoArtifactsPlugin(mode: string): Plugin {
  let outDirAbs = "";
  let rootAbs = "";
  return {
    name: "seo-artifacts",
    configResolved(resolved) {
      rootAbs = resolved.root;
      outDirAbs = path.resolve(rootAbs, resolved.build.outDir);
    },
    closeBundle() {
      const env = loadEnv(mode, process.cwd(), "");
      const siteUrlRaw = (env.VITE_SITE_URL ?? "").trim();
      const siteUrl = siteUrlRaw.replace(/\/+$/, "");
      const basePrefix = deployPathPrefix(env.VITE_BASE_URL || "/");

      let robots = `User-agent: *\nAllow: /\n`;
      if (siteUrl) {
        const sitemapLoc = joinPublicUrl(siteUrl, basePrefix, "/sitemap.xml");
        robots += `\nSitemap: ${sitemapLoc}\n`;
      }
      fs.writeFileSync(path.join(outDirAbs, "robots.txt"), robots, "utf8");

      if (!siteUrl) {
        console.warn(
          "[seo-artifacts] VITE_SITE_URL is empty: skipped sitemap.xml. Set it for production SEO.",
        );
        return;
      }

      const pathnames = computeSitemapPathnames();
      const urlEntries = pathnames.map((pathname) => {
        const loc = escapeXml(joinPublicUrl(siteUrl, basePrefix, pathname));
        const priority =
          pathname === "/" || pathname === "/en" ? "1.0" : "0.8";
        return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
      });

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>
`;
      fs.writeFileSync(path.join(outDirAbs, "sitemap.xml"), xml, "utf8");
    },
  };
}

function pdfJsAssetsPlugin(): Plugin {
  let rootAbs = "";
  let outDirAbs = "";

  const assetRoots = [
    { urlPrefix: `${pdfJsPublicBase}/cmaps/`, fsDir: pdfJsCmapsDir },
    { urlPrefix: `${pdfJsPublicBase}/standard_fonts/`, fsDir: pdfJsStandardFontsDir },
  ];

  return {
    name: "pdfjs-assets",
    configResolved(resolved) {
      rootAbs = resolved.root;
      outDirAbs = path.resolve(rootAbs, resolved.build.outDir);
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const requestUrl = req.url ?? "";
        const match = assetRoots.find(({ urlPrefix }) => requestUrl.startsWith(urlPrefix));
        if (!match) {
          next();
          return;
        }

        const relPath = decodeURIComponent(requestUrl.slice(match.urlPrefix.length));
        const filePath = path.join(match.fsDir, relPath);
        if (!filePath.startsWith(match.fsDir) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }

        res.statusCode = 200;
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Content-Type", "application/octet-stream");
        fs.createReadStream(filePath).pipe(res);
      });
    },
    closeBundle() {
      copyDirSync(pdfJsCmapsDir, path.join(outDirAbs, pdfJsPublicBase, "cmaps"));
      copyDirSync(pdfJsStandardFontsDir, path.join(outDirAbs, pdfJsPublicBase, "standard_fonts"));
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      injectSiteNameInHtmlPlugin(env),
      pdfJsAssetsPlugin(),
      seoArtifactsPlugin(mode),
    ],
    base: env.VITE_BASE_URL || "/",
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: ['portaltest.local'],
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8000",
          changeOrigin: false,
        },
        "/wcm-portal": {
          target: "https://portaltest.moi.gov.qa",
          changeOrigin: true,
          secure: true,
        },
      },
    },
    build: {
      rollupOptions: {
        onLog(level, log, defaultHandler) {
          if (level === "warn") {
            const msg = typeof log === "string" ? log : (log as { message?: string }).message ?? "";
            if (msg.includes("Use of direct") && msg.includes("eval") && msg.includes("pdfjs-dist")) {
              return;
            }
          }
          defaultHandler(level, log);
        },
      },
    },
  };
});
