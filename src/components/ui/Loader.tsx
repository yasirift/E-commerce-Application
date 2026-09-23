interface LoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const SIZE_CLASSES = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

export default function Loader({ size = "md", label }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div
        className={[
          "animate-spin rounded-full border-primary border-t-transparent",
          SIZE_CLASSES[size],
        ].join(" ")}
        role="status"
        aria-label={label ?? "loading"}
      />
      {label && <p className="text-sm text-muted">{label}</p>}
    </div>
  );
}
