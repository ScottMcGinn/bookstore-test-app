import { useState, useEffect } from 'react';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import SearchBar from './components/SearchBar';
import AddBookForm from './components/AddBookForm';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import { useCart } from './context/CartContext';
import bookService from './services/bookService';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const { getTotalItems } = useCart();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    author: ''
  });

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getAllBooks(filterParams);
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      setError('Failed to load books. Please make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    fetchBooks(searchFilters);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseDetail = () => {
    setSelectedBook(null);
  };

  const handleAddBook = async (bookData) => {
    try {
      await bookService.createBook(bookData);
      setShowAddForm(false);
      fetchBooks(filters); // Refresh the list
      alert('Book added successfully!');
    } catch (err) {
      alert(`Failed to add book: ${err.message}`);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await bookService.deleteBook(bookId);
      setSelectedBook(null);
      fetchBooks(filters); // Refresh the list
      alert('Book deleted successfully!');
    } catch (err) {
      alert(`Failed to delete book: ${err.message}`);
    }
  };

  const handleUpdateBook = async (bookId, bookData) => {
    try {
      await bookService.updateBook(bookId, bookData);
      fetchBooks(filters); // Refresh the list
      // Update selected book if it's the one being viewed
      if (selectedBook && selectedBook.id === bookId) {
        const updatedBook = await bookService.getBookById(bookId);
        setSelectedBook(updatedBook);
      }
      alert('Book updated successfully!');
    } catch (err) {
      alert(`Failed to update book: ${err.message}`);
    }
  };

  const handleCheckoutStart = () => {
    setShowCheckout(true);
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
  };

  const handleOrderComplete = (order) => {
    setOrderData(order);
    setShowCheckout(false);
  };

  const handleBackToHome = () => {
    setOrderData(null);
    setShowCart(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📚 Bookstore</h1>
          <p className="subtitle">Test Automation Practice Application</p>
        </div>
        <div className="header-buttons">
          <button 
            className="cart-btn"
            onClick={() => setShowCart(!showCart)}
            data-testid="cart-btn"
          >
            🛒 Cart
            {getTotalItems() > 0 && (
              <span className="cart-badge" data-testid="cart-badge">
                {getTotalItems()}
              </span>
            )}
          </button>
          <button 
            className="add-book-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add Book'}
          </button>
        </div>
      </header>

      <main className="app-main">
        {showAddForm && (
          <div className="add-book-section">
            <AddBookForm 
              onSubmit={handleAddBook}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        <SearchBar onSearch={handleSearch} />

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading books...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={() => fetchBooks()}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="books-count">
              Found {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
            </div>
            
            <BookList 
              books={filteredBooks} 
              onBookClick={handleBookClick}
            />
          </>
        )}

        {selectedBook && (
          <BookDetail 
            book={selectedBook}
            onClose={handleCloseDetail}
            onDelete={handleDeleteBook}
            onUpdate={handleUpdateBook}
          />
        )}

        {showCart && (
          <Cart onClose={() => setShowCart(false)} onCheckout={handleCheckoutStart} />
        )}

        {showCheckout && (
          <Checkout onClose={handleCheckoutClose} onOrderComplete={handleOrderComplete} />
        )}

        {orderData && (
          <OrderConfirmation order={orderData} onBackToHome={handleBackToHome} />
        )}
      </main>

      <footer className="app-footer">
        <p>Backend API: <a href="http://localhost:3001/api-docs" target="_blank" rel="noopener noreferrer">http://localhost:3001/api-docs</a></p>
        <p>Created for test automation practice</p>
      </footer>
    </div>
  );
}

export default App;
