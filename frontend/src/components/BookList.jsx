import { useCart } from '../context/CartContext';
import './BookList.css';

function BookList({ books, onBookClick }) {
  const { addToCart } = useCart();
  if (books.length === 0) {
    return (
      <div className="no-books">
        <p>No books found</p>
        <p className="hint">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="book-list" role="region" aria-label="List of available books">
      {books.map((book) => (
        <div 
          key={book.id} 
          className="book-card"
          onClick={() => onBookClick(book)}
          data-testid={`book-card-${book.id}`}
          role="button"
          tabIndex={0}
          aria-label={`${book.title} by ${book.author}, $${book.price.toFixed(2)}`}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onBookClick(book);
            }
          }}
        >
          <div className="book-card-image">
            {book.coverImage ? (
              <img src={book.coverImage} alt={`Cover of ${book.title}`} />
            ) : (
              <div className="book-placeholder" aria-label="No cover image available">📖</div>
            )}
          </div>
          
          <div className="book-card-content">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">by {book.author}</p>
            
            <div className="book-meta">
              <span className="book-category">{book.category}</span>
              {book.publicationYear && (
                <span className="book-year">{book.publicationYear}</span>
              )}
            </div>
            
            <div className="book-footer">
              <span className="book-price">${book.price.toFixed(2)}</span>
              <span className={`book-stock ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`} aria-live="polite">
                {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
              </span>
            </div>
            
            <button
              className={`add-to-cart-btn ${book.stock > 0 ? '' : 'disabled'}`}
              onClick={(e) => {
                e.stopPropagation();
                if (book.stock > 0) {
                  addToCart(book, 1);
                  alert(`Added "${book.title}" to cart!`);
                }
              }}
              disabled={book.stock <= 0}
              data-testid={`add-to-cart-${book.id}`}
              aria-label={`Add ${book.title} to shopping cart${book.stock <= 0 ? ' (out of stock)' : ''}`}
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookList;
