export const Divider = () => {
  return (
    <div className="mx-auto mt-5 flex items-center justify-center gap-2">
      <span className="h-px w-12 bg-secondary/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
      <span className="h-px w-12 bg-secondary/40" />
    </div>
  );
};

export const DividerWithThreeDots = () => {
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <span className="h-px w-12 bg-secondary/30" />
      <span className="h-1.5 w-1.5 rounded-full bg-secondary/60" />
      <span className="h-px w-24 bg-secondary/50" />
      <span className="h-2 w-2 rounded-full bg-secondary" />
      <span className="h-px w-24 bg-secondary/50" />
      <span className="h-1.5 w-1.5 rounded-full bg-secondary/60" />
      <span className="h-px w-12 bg-secondary/30" />
    </div>
  );
};


export const DividerLine = () => {
    return (
        <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-linear-to-l from-transparent via-secondary to-transparent" />
    );
};

/** Line–dot–line accent aligned to inline start (e.g. under section titles in RTL). */
export const DividerStartAccent = ({
  className = "",
}: {
  className?: string;
}) => (
  <div
    className={`mt-4 flex items-center justify-start gap-2${className ? ` ${className}` : ""}`}
  >
    <span className="h-px w-14 bg-secondary/40" />
    <span className="h-2 w-2 rounded-full bg-secondary" />
    <span className="h-px w-14 bg-secondary/40" />
  </div>
);

