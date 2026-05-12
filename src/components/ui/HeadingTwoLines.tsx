import { Divider } from "./Divider";

type HeadingTwoLinesProps = {
  main: string;
  accent: string;
  className?: string;
  divider?: boolean;
};

/**
 * Section heading with a primary title and stacked accent line (blog-style).
 */
export default function HeadingTwoLines({
  main,
  accent,
  className = "",
  divider = true,
}: HeadingTwoLinesProps) {
  return (
    <>
    <h2
      className={`mt-4 text-lg lg:text-2xl font-bold leading-snug text-primary ${className}`}
    >
      {main} {accent}
      {/* <span className="block text-secondary">{accent}</span> */}
    </h2>
    {divider && <Divider />}
    </>
  );
}
