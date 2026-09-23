import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const generateId = useId();
    const inputId = id ?? generateId;

    return (
      <div>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-ink"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          className={[
            "mt-1.5 w-full rounded-md border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted",
            "focus:border-primary",
            error ? "border-danger" : "border-border",
            className,
          ].join(" ")}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
