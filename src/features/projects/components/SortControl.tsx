import type { ProjectSortMode } from "../types";

type SortOption = {
  value: ProjectSortMode;
  label: string;
};

type SortControlProps = {
  value: ProjectSortMode;
  onChange: (value: ProjectSortMode) => void;
  options?: SortOption[];
};

const defaultOptions: SortOption[] = [
  { value: "recent", label: "Most recent" },
  { value: "name", label: "Name" },
];

export const SortControl = ({
  value,
  onChange,
  options = defaultOptions,
}: SortControlProps) => (
  <label className="sort-control">
    <span className="sort-label">Sort</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as ProjectSortMode)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);
