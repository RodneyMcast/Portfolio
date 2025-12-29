type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search projects...",
}: SearchBarProps) => (
  <label className="search-bar">
    <span className="search-label">Search</span>
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  </label>
);
