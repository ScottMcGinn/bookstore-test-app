import { useState, useEffect, useCallback, useRef } from 'react';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import SearchBar from './components/SearchBar';
import AddBookForm from './components/AddBookForm';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import LoginPage from './components/LoginPage';
import RoleProtected from './components/RoleProtected';
import CustomerProfile from './components/CustomerProfile';
import Stocktake from './components/Stocktake';
import UserManagement from './components/UserManagement';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import bookService from './services/bookService';
import userService from './services/userService';
import './App.css';

function App() {
  const { user, logout, restoreSession } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showStocktake, setShowStocktake] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const { getTotalItems } = useCart();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    author: ''
  });

  // Prevent duplicate fetch on mount
  const hasFetchedRef = useRef(false);
  
  // Track session restoration to prevent infinite loop
  const hasRestoredRef = useRef(false);

  // Restore session on mount (only once) - use ref to prevent render loop
  useEffect(() => {
    if (!hasRestoredRef.current) {
      hasRestoredRef.current = true;
      restoreSession();
    }
  }, []);

  // Memoized fetch function to prevent re-creation on each render
  const fetchBooks = useCallback(async (filterParams = {}) => {
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
  }, []);

  // Fetch books on component mount only (not when user changes)
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchBooks();
    }
  }, []);

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

  const handleOrderComplete = async (order) => {
    try {
      // Generate a unique order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Transform order data to match backend schema
      const orderToSave = {
        orderId: orderId,
        orderDate: order.orderDate,
        total: order.total,
        items: order.items.map(item => ({
          bookId: item.id,
          title: item.title,
          author: item.author,
          price: item.price,
          quantity: item.quantity
        })),
        status: 'pending',
        shippingAddress: {
          street: order.shipping.address,
          city: order.shipping.city,
          state: order.shipping.state,
          zipCode: order.shipping.zipCode,
          country: order.shipping.country
        }
      };

      // Save order to backend
      await userService.addOrder(user.id, orderToSave);
      
      // Add orderId to order data for confirmation display
      setOrderData({ ...order, orderId: orderId });
      setShowCheckout(false);
    } catch (error) {
      console.error('Error saving order:', error);
      // Still show confirmation but log the error
      setOrderData(order);
      setShowCheckout(false);
    }
  };

  const handleBackToHome = () => {
    setOrderData(null);
    setShowCart(false);
  };

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <header className="app-header" role="banner">
        <div className="header-content">
          <div className="header-title">
            <h1>📚 Bookstore</h1>
            <p className="subtitle">Test Automation Practice Application</p>
          </div>
          <div className="user-info">
            <span className="user-role">{user.role.toUpperCase()}</span>
            <span className="user-name">{user.fullName}</span>
          </div>
        </div>
        <div className="header-buttons" role="toolbar" aria-label="Application controls">
          <RoleProtected allowedRoles={['customer']} fallback={null}>
            <button 
              className="profile-btn"
              onClick={() => setShowProfile(!showProfile)}
              data-testid="profile-btn"
              aria-label="View my profile"
              aria-pressed={showProfile}
            >
              👤 Profile
            </button>
          </RoleProtected>
          <RoleProtected allowedRoles={['customer']} fallback={null}>
            <button 
              className="cart-btn"
              onClick={() => setShowCart(!showCart)}
              data-testid="cart-btn"
              aria-label={`Shopping cart with ${getTotalItems()} items`}
              aria-pressed={showCart}
            >
              🛒 Cart
              {getTotalItems() > 0 && (
                <span className="cart-badge" data-testid="cart-badge" aria-hidden="false">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </RoleProtected>
          <RoleProtected allowedRoles={['admin', 'staff']} fallback={null}>
            <button 
              className="add-book-btn"
              onClick={() => setShowAddForm(!showAddForm)}
              aria-label={showAddForm ? 'Close add book form' : 'Open form to add a new book'}
              aria-pressed={showAddForm}
            >
              {showAddForm ? 'Cancel' : '+ Add Book'}
            </button>
          </RoleProtected>
          <RoleProtected allowedRoles={['admin', 'staff']} fallback={null}>
            <button 
              className="stocktake-btn"
              onClick={() => setShowStocktake(!showStocktake)}
              aria-label="View stock levels"
              aria-pressed={showStocktake}
            >
              📊 Stocktake
            </button>
          </RoleProtected>
          <RoleProtected allowedRoles={['admin']} fallback={null}>
            <button 
              className="user-management-btn"
              onClick={() => setShowUserManagement(!showUserManagement)}
              aria-label="Manage users"
              aria-pressed={showUserManagement}
            >
              👥 Users
            </button>
          </RoleProtected>
          <button 
            className="logout-btn"
            onClick={logout}
            aria-label="Logout from account"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-main" role="main" aria-label="Main content">
        {showProfile && (
          <RoleProtected allowedRoles={['customer']} fallback={null}>
            <div className="profile-section" role="region" aria-labelledby="profile-title">
              <button 
                className="close-btn"
                onClick={() => setShowProfile(false)}
                aria-label="Close profile"
              >
                ✕
              </button>
              <CustomerProfile />
            </div>
          </RoleProtected>
        )}

        <RoleProtected allowedRoles={['admin', 'staff']} fallback={null}>
          {showAddForm && (
            <div className="add-book-section" role="region" aria-labelledby="add-form-title">
              <AddBookForm 
                onSubmit={handleAddBook}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}
        </RoleProtected>

        <RoleProtected allowedRoles={['admin', 'staff']} fallback={null}>
          {showStocktake && (
            <div className="stocktake-section" role="region" aria-labelledby="stocktake-title">
              <Stocktake />
            </div>
          )}
        </RoleProtected>

        <RoleProtected allowedRoles={['admin']} fallback={null}>
          {showUserManagement && (
            <div className="user-management-section" role="region" aria-labelledby="user-management-title">
              <UserManagement />
            </div>
          )}
        </RoleProtected>

        <SearchBar onSearch={handleSearch} />

        {loading && (
          <div className="loading" role="status" aria-live="polite" aria-label="Loading content">
            <div className="spinner"></div>
            <p>Loading books...</p>
          </div>
        )}

        {error && (
          <div className="error-message" role="alert">
            <p>⚠️ {error}</p>
            <button onClick={() => fetchBooks()} aria-label="Retry loading books">Retry</button>
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
          <RoleProtected allowedRoles={['customer']} fallback={null}>
            <Cart onClose={() => setShowCart(false)} onCheckout={handleCheckoutStart} />
          </RoleProtected>
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
