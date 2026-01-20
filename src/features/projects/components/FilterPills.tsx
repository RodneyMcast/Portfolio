import type { ProjectFilterCategory } from '../types';

export type FilterOption = {
  value: ProjectFilterCategory;
  label: string;
};

type FilterPillsProps = {
  options: FilterOption[];
  active: ProjectFilterCategory;
  onChange: (value: ProjectFilterCategory) => void;
  disabled?: boolean;
};

// Simple pill group with aria-pressed for accessibility.
export const FilterPills = ({ options, active, onChange, disabled = false }: FilterPillsProps) => (
  <div className="filter-pills" role="group" aria-label="Project filters">
    {options.map((option) => {
      const isActive = option.value === active;

      return isActive ? (
        <button
          key={option.value}
          type="button"
          className="pill is-active"
          onClick={() => onChange(option.value)}
          // aria-pressed communicates the selected state.
          aria-pressed="true"
          disabled={disabled}
        >
          {option.label}
        </button>
      ) : (
        <button
          key={option.value}
          type="button"
          className="pill"
          onClick={() => onChange(option.value)}
          // Keep false for screen readers when not active.
          aria-pressed="false"
          disabled={disabled}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);
