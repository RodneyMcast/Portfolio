type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

// Controlled input so Redux can own the search query.
export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search projects...',
  disabled = false,
}: SearchBarProps) => (
  // Label keeps it accessible even with a hidden text.
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
