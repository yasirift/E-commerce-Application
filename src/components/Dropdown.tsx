import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface DropdownItem {
  label: string;
  onSelect: () => void;
  danger?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
}

export default function Dropdown({ trigger, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center">
        {trigger}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                item.danger ? "text-red-600" : "text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
