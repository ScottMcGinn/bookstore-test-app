import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './BookDetail.css';

function BookDetail({ book, onClose, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const { addToCart } = useCart();
  const [editForm, setEditForm] = useState({
    title: book.title,
    author: book.author,
    price: book.price,
    stock: book.stock,
    description: book.description
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onUpdate(book.id, editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      title: book.title,
      author: book.author,
      price: book.price,
      stock: book.stock,
      description: book.description
    });
    setIsEditing(false);
  };

  return (
    <div className="book-detail-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="book-title">
      <div className="book-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close book details">×</button>
        
        <div className="book-detail-content">
          <div className="book-detail-image">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} />
            ) : (
              <div className="book-placeholder-large">📖</div>
            )}
          </div>
          
          <div className="book-detail-info">
            {!isEditing ? (
              <>
                <h2 id="book-title">{book.title}</h2>
                <p className="detail-author">by {book.author}</p>
                
                <div className="detail-meta">
                  <span className="detail-category">{book.category}</span>
                  {book.publicationYear && (
                    <span className="detail-year">Published: {book.publicationYear}</span>
                  )}
                </div>
                
                <div className="detail-section">
                  <h3>Description</h3>
                  <p>{book.description}</p>
                </div>
                
                <div className="detail-section">
                  <h3>Details</h3>
                  <table className="detail-table">
                    <tbody>
                      <tr>
                        <td><strong>ISBN:</strong></td>
                        <td>{book.isbn}</td>
                      </tr>
                      <tr>
                        <td><strong>Publisher:</strong></td>
                        <td>{book.publisher}</td>
                      </tr>
                      <tr>
                        <td><strong>Price:</strong></td>
                        <td>${book.price.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td><strong>Stock:</strong></td>
                        <td className={book.stock > 0 ? 'text-success' : 'text-danger'}>
                          {book.stock > 0 ? `${book.stock} available` : 'Out of stock'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="detail-actions">
                  <button className="btn-edit" onClick={() => setIsEditing(true)} aria-label={`Edit book: ${book.title}`}>
                    Edit Book
                  </button>
                  <button 
                    className={`btn-add-to-cart ${book.stock > 0 ? '' : 'disabled'}`}
                    onClick={() => {
                      if (book.stock > 0) {
                        addToCart(book, 1);
                        alert(`Added to cart!`);
                      }
                    }}
                    disabled={book.stock <= 0}
                    aria-label={`Add ${book.title} to shopping cart${book.stock > 0 ? `, ${book.stock} available` : ', currently out of stock'}`}
                  >
                    🛒 Add to Cart
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(book.id)} aria-label={`Delete book: ${book.title}`}>
                    Delete Book
                  </button>
                </div>
              </>
            ) : (
              <div className="edit-form">
                <h2>Edit Book</h2>
                
                <div className="form-group">
                  <label htmlFor="edit-title">Title</label>
                  <input 
                    id="edit-title"
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleInputChange}
                    aria-label="Book title"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-author">Author</label>
                  <input 
                    id="edit-author"
                    type="text"
                    name="author"
                    value={editForm.author}
                    onChange={handleInputChange}
                    aria-label="Author name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-price">Price ($)</label>
                    <input 
                      id="edit-price"
                      type="number"
                      name="price"
                      step="0.01"
                      value={editForm.price}
                      onChange={handleInputChange}
                      aria-label="Book price in dollars"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-stock">Stock</label>
                    <input 
                      id="edit-stock"
                      type="number"
                      name="stock"
                      value={editForm.stock}
                      onChange={handleInputChange}
                      aria-label="Number of copies in stock"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-description">Description</label>
                  <textarea 
                    id="edit-description"
                    name="description"
                    rows="4"
                    value={editForm.description}
                    onChange={handleInputChange}
                    aria-label="Book description"
                  />
                </div>

                <div className="edit-actions">
                  <button className="btn-save" onClick={handleSave} aria-label="Save book changes">
                    Save Changes
                  </button>
                  <button className="btn-cancel" onClick={handleCancel} aria-label="Cancel editing">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
