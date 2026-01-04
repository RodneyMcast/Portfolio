type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search projects...',
  disabled = false,
}: SearchBarProps) => (
  <label className="search-bar">
    <span className="sr-only">Search projects</span>
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  </label>
);
