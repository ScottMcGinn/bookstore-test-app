const API_BASE_URL = 'http://localhost:3001/api';

class BookService {
  async getAllBooks(filters = {}, retries = 3, baseDelay = 1000) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const queryParams = new URLSearchParams();
        
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.author) queryParams.append('author', filters.author);
        if (filters.search) queryParams.append('search', filters.search);
        
        const url = `${API_BASE_URL}/books${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        const isLastAttempt = attempt === retries - 1;
        console.error(`[Attempt ${attempt + 1}/${retries}] Error fetching books:`, error);
        
        if (isLastAttempt) {
          throw error;
        }
        
        // Exponential backoff before retry
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
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
