import { API_BASE_URL } from "@/config/api";
import type { PublicationDoc } from "@/types/page.d.ts";

export type PublicationCategoryItem = { id: string; label: string };

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const detail = await response.json().catch(() => ({} as { detail?: string; message?: string }));
    const message = detail?.detail || detail?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

function normalizePublication(doc: PublicationDoc): PublicationDoc {
  return {
    ...doc,
    cover: doc.cover || "",
    url: doc.url || "",
    subtitle: doc.subtitle?.trim() || undefined,
    audio: doc.audio || undefined,
    video: doc.video || undefined,
  };
}

export async function fetchPublications(signal?: AbortSignal): Promise<PublicationDoc[]> {
  const response = await fetch(`${API_BASE_URL}/api/publications/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  const data = await readJsonResponse<PublicationDoc[]>(response);
  return Array.isArray(data) ? data.map(normalizePublication) : [];
}

export type PublicationStatsResponse = {
  total: number;
  counts: Record<string, number>;
};

export async function fetchPublicationStats(signal?: AbortSignal): Promise<PublicationStatsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/publications/stats/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  const data = await readJsonResponse<PublicationStatsResponse>(response);
  return {
    total: typeof data?.total === "number" ? data.total : 0,
    counts: data && typeof data.counts === "object" && data.counts ? data.counts : {},
  };
}

export async function fetchPublicationCategories(signal?: AbortSignal): Promise<PublicationCategoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/public/categories/`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  const data = await readJsonResponse<PublicationCategoryItem[]>(response);
  return Array.isArray(data) ? data.filter((c) => c.id && c.label) : [];
}
