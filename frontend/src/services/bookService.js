const API_BASE_URL = 'http://localhost:3001/api';

class BookService {
  async getAllBooks(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.author) queryParams.append('author', filters.author);
      if (filters.search) queryParams.append('search', filters.search);
      
      const url = `${API_BASE_URL}/books${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  async getBookById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Book not found');
        }
        throw new Error('Failed to fetch book');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }

  async createBook(bookData) {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create book');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  }

  async updateBook(id, bookData) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update book');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }

  async deleteBook(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete book');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }
}

export default new BookService();
