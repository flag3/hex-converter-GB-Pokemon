import { memo } from "react";
import type { SelectorOption } from "./../types";

type SelectorProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectorOption[];
};

export const Selector = memo(({
  label,
  value,
  onChange,
  options,
}: SelectorProps) => {
  return (
    <div>
      {label}
      <select value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});
