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
    <div className="add-book-form">
      <h2>Add New Book</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              data-testid="input-title"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={errors.author ? 'error' : ''}
              data-testid="input-author"
            />
            {errors.author && <span className="error-message">{errors.author}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>ISBN *</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="978-0-123-45678-9"
              className={errors.isbn ? 'error' : ''}
              data-testid="input-isbn"
            />
            {errors.isbn && <span className="error-message">{errors.isbn}</span>}
          </div>

          <div className="form-group">
            <label>Price ($) *</label>
            <input
              type="number"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error' : ''}
              data-testid="input-price"
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              data-testid="input-category"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Publication Year</label>
            <input
              type="number"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              placeholder="2024"
              data-testid="input-year"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Publisher</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              data-testid="input-publisher"
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              data-testid="input-stock"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            data-testid="input-description"
          />
        </div>

        <div className="form-group">
          <label>Cover Image URL</label>
          <input
            type="url"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            data-testid="input-cover-image"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" data-testid="submit-button">
            Add Book
          </button>
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBookForm;
