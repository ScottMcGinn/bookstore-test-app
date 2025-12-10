import { useState, useEffect } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');

  const categories = [
    'All Categories',
    'Fiction',
    'Science Fiction',
    'Fantasy',
    'Romance',
    'Mystery'
  ];

  const handleSearch = () => {
    onSearch({
      search: searchTerm,
      category: category === 'All Categories' ? '' : category,
      author: author
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategory('');
    setAuthor('');
    onSearch({
      search: '',
      category: '',
      author: ''
    });
  };

  // Search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-inputs">
        <div className="search-group">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
            data-testid="search-input"
            aria-label="Search books by title or description"
          />
        </div>

        <div className="filter-group">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
            data-testid="category-filter"
            aria-label="Filter books by category"
          >
            <option value="">All Categories</option>
            {categories.slice(1).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter by author..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            onKeyPress={handleKeyPress}
            className="filter-input"
            data-testid="author-filter"
            aria-label="Filter books by author name"
          />
        </div>
      </div>

      <div className="search-actions">
        <button 
          onClick={handleSearch}
          className="btn-search"
          data-testid="search-button"
          aria-label="Execute search with current filters"
        >
          🔍 Search
        </button>
        <button 
          onClick={handleReset}
          className="btn-reset"
          data-testid="reset-button"
          aria-label="Clear all search and filter fields"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
