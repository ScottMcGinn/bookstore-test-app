import { useState } from 'react';
import './AddBookForm.css';

function AddBookForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    category: 'Fiction',
    description: '',
    publicationYear: '',
    publisher: '',
    stock: '',
    coverImage: ''
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Fiction',
    'Science Fiction',
    'Fantasy',
    'Romance',
    'Mystery',
    'Non-Fiction',
    'Biography',
    'History',
    'Self-Help',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: formData.stock ? parseInt(formData.stock) : 0,
        publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : null
      };
      
      onSubmit(bookData);
    }
  };

  return (
    <div className="add-book-form" role="region" aria-label="Add new book form">
      <h2>Add New Book</h2>
      
      <form onSubmit={handleSubmit} aria-label="Book details form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="form-title">Title *</label>
            <input
              id="form-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              data-testid="input-title"
              aria-label="Book title"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && <span className="error-message" id="title-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="form-author">Author *</label>
            <input
              id="form-author"
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={errors.author ? 'error' : ''}
              data-testid="input-author"
              aria-label="Author name"
              aria-invalid={!!errors.author}
              aria-describedby={errors.author ? 'author-error' : undefined}
            />
            {errors.author && <span className="error-message" id="author-error">{errors.author}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="form-isbn">ISBN *</label>
            <input
              id="form-isbn"
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="978-0-123-45678-9"
              className={errors.isbn ? 'error' : ''}
              data-testid="input-isbn"
              aria-label="International Standard Book Number (ISBN)"
              aria-invalid={!!errors.isbn}
              aria-describedby={errors.isbn ? 'isbn-error' : undefined}
            />
            {errors.isbn && <span className="error-message" id="isbn-error">{errors.isbn}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="form-price">Price ($) *</label>
            <input
              id="form-price"
              type="number"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error' : ''}
              data-testid="input-price"
              aria-label="Book price in dollars"
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? 'price-error' : undefined}
            />
            {errors.price && <span className="error-message" id="price-error">{errors.price}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="form-category">Category</label>
            <select
              id="form-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              data-testid="input-category"
              aria-label="Book category or genre"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="form-year">Publication Year</label>
            <input
              id="form-year"
              type="number"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              placeholder="2024"
              data-testid="input-year"
              aria-label="Year of publication"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="form-publisher">Publisher</label>
            <input
              id="form-publisher"
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              data-testid="input-publisher"
              aria-label="Publishing company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="form-stock">Stock</label>
            <input
              id="form-stock"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              data-testid="input-stock"
              aria-label="Number of copies in stock"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="form-description">Description</label>
          <textarea
            id="form-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            data-testid="input-description"
            aria-label="Book description or synopsis"
          />
        </div>

        <div className="form-group">
          <label htmlFor="form-cover">Cover Image URL</label>
          <input
            id="form-cover"
            type="url"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            data-testid="input-cover-image"
            aria-label="URL link to book cover image"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" data-testid="submit-button" aria-label="Submit the form and add the new book to the library">
            Add Book
          </button>
          <button type="button" onClick={onCancel} className="btn-cancel" aria-label="Cancel and close the add book form">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBookForm;
