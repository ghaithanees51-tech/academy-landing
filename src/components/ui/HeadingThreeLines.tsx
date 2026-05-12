import { Divider } from "./Divider";

type HeadingThreeLines = {
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
}: HeadingThreeLines) {
  return (
	<>
	<h2
	  className={`mt-4 text-lg lg:text-2xl font-bold leading-snug text-primary ${className}`}
	>
	  {main}
	  {<span className="block text-secondary">{accent}</span> }
	</h2>
	{divider && <Divider />}
	</>
  );
}
