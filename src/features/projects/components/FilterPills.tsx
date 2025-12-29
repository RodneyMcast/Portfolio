import type { ProjectFilterCategory } from "../types";

export type FilterOption = {
  value: ProjectFilterCategory;
  label: string;
};

type FilterPillsProps = {
  options: FilterOption[];
  active: ProjectFilterCategory;
  onChange: (value: ProjectFilterCategory) => void;
};

export const FilterPills = ({
  options,
  active,
  onChange,
}: FilterPillsProps) => (
  <div className="filter-pills" role="group" aria-label="Project filters">
    {options.map((option) => {
      const isActive = option.value === active;

      return isActive ? (
        <button
          key={option.value}
          type="button"
          className="pill is-active"
          onClick={() => onChange(option.value)}
          aria-pressed="true"
        >
          {option.label}
        </button>
      ) : (
        <button
          key={option.value}
          type="button"
          className="pill"
          onClick={() => onChange(option.value)}
          aria-pressed="false"
        >
          {option.label}
        </button>
      );
    })}
  </div>
);
