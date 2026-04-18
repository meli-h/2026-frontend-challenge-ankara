interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <input
      type="search"
      placeholder={placeholder ?? 'Search by person name...'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-400 focus:outline-none"
    />
  );
}

export default SearchBar;
