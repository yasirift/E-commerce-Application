import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, placeholder, id, className = "", ...props },
    ref,
  ) => {
    const generateId = useId();
    const selectId = id ?? generateId;

    return (
      <div>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-ink"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          aria-invalid={!!error}
          className={[
            "mt-1.5 w-full rounded-md border bg-surface px-3 py-2.5 text-sm text-ink",
            "focus:border-primary",
            error ? "border-danger" : "border-border",
            className,
          ].join(" ")}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}{" "}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
export default Select;
