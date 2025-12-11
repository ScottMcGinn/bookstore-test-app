import React, { useState, useEffect } from 'react';
import './Stocktake.css';

function Stocktake() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchTerm, sortBy, lowStockOnly, lowStockThreshold]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:3001/api/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message || 'Error loading stock data');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStock = !lowStockOnly || book.stock < lowStockThreshold;
      
      return matchesSearch && matchesStock;
    });

    // Sort books
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'stock-asc':
          return a.stock - b.stock;
        case 'stock-desc':
          return b.stock - a.stock;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  };

  const getTotalStock = () => {
    return books.reduce((sum, book) => sum + book.stock, 0);
  };

  const getTotalValue = () => {
    return books.reduce((sum, book) => sum + (book.price * book.stock), 0);
  };

  const getLowStockCount = () => {
    return books.filter(book => book.stock < lowStockThreshold).length;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < lowStockThreshold) return 'low-stock';
    return 'in-stock';
  };

  if (loading) {
    return (
      <div className="stocktake-container">
        <div className="stocktake-loading">Loading stock data...</div>
      </div>
    );
  }

  return (
    <div className="stocktake-container">
      <div className="stocktake-header">
        <h1>📊 Stock Level Report</h1>
        <p className="stocktake-subtitle">Track inventory and monitor stock levels</p>
      </div>

      {error && (
        <div className="stocktake-error" role="alert">
          {error}
          <button onClick={fetchBooks} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-label">Total Books</div>
          <div className="summary-value">{books.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total Stock Units</div>
          <div className="summary-value">{getTotalStock()}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Stock Value</div>
          <div className="summary-value">${getTotalValue().toFixed(2)}</div>
        </div>
        <div className="summary-card warning">
          <div className="summary-label">Low Stock Items</div>
          <div className="summary-value">{getLowStockCount()}</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="stocktake-controls">
        <div className="control-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search books"
          />
        </div>

        <div className="control-group">
          <label>Sort by:</label>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort books"
          >
            <option value="title">Title (A-Z)</option>
            <option value="stock-asc">Stock (Low to High)</option>
            <option value="stock-desc">Stock (High to Low)</option>
            <option value="category">Category</option>
          </select>
        </div>

        <div className="control-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              aria-label="Show only low stock items"
            />
            <span>Show Low Stock Only</span>
          </label>
          
          {lowStockOnly && (
            <div className="threshold-control">
              <label>Threshold:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value))}
                aria-label="Low stock threshold"
              />
              <span>units</span>
            </div>
          )}
        </div>
      </div>

      {/* Stock Table */}
      <div className="stocktake-table-wrapper">
        {filteredBooks.length === 0 ? (
          <div className="no-results">
            {lowStockOnly ? 'No low stock items found' : 'No books found matching your search'}
          </div>
        ) : (
          <table className="stocktake-table" aria-label="Stock levels table">
            <thead>
              <tr>
                <th className="col-title">Title</th>
                <th className="col-author">Author</th>
                <th className="col-isbn">ISBN</th>
                <th className="col-category">Category</th>
                <th className="col-price">Price</th>
                <th className="col-stock">Stock</th>
                <th className="col-value">Value</th>
                <th className="col-status">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => {
                const status = getStockStatus(book.stock);
                const itemValue = (book.price * book.stock).toFixed(2);
                return (
                  <tr key={book.id} className={`row-${status}`}>
                    <td className="col-title">
                      <strong>{book.title}</strong>
                    </td>
                    <td className="col-author">{book.author}</td>
                    <td className="col-isbn">{book.isbn || '-'}</td>
                    <td className="col-category">{book.category}</td>
                    <td className="col-price">${book.price.toFixed(2)}</td>
                    <td className="col-stock">
                      <span className={`stock-badge ${status}`}>{book.stock}</span>
                    </td>
                    <td className="col-value">${itemValue}</td>
                    <td className="col-status">
                      <span className={`status-badge ${status}`}>
                        {status === 'out-of-stock' && '⚠️ Out of Stock'}
                        {status === 'low-stock' && '⚠️ Low Stock'}
                        {status === 'in-stock' && '✅ In Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      <div className="stocktake-footer">
        <p>Showing {filteredBooks.length} of {books.length} books</p>
      </div>
    </div>
  );
}

export default Stocktake;
