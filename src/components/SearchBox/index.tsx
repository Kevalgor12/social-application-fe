import React from "react";
import "./searchBox.scss";

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange?: (term: string) => void;
  onClearSearch?: () => void;
  resultCount?: number;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchTerm,
  onSearchChange,
  resultCount,
  placeholder = "Search posts by title, or description...",
}) => {
  const [inputValue, setInputValue] = React.useState(searchTerm);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue?.(e.target.value);
  };
  const handleInputChange = (): void => {
    onSearchChange?.(inputValue);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleInputChange}>
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleSearch}
          />
          <button
            type="submit"
            className="search-button"
            onClick={handleInputChange}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginRight: "4px", verticalAlign: "middle" }}
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>
      {searchTerm && resultCount !== undefined && (
        <div className="search-results">
          Found {resultCount} {resultCount === 1 ? "result" : "results"} for "
          {searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchBox;
