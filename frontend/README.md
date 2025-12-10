# Frontend

React application for the bookstore built with Vite.

## Features

- **Book Browsing**: View all books in a responsive grid layout
- **Search & Filter**: Search by title/description, filter by category and author
- **Book Details**: Click any book to see full details in a modal
- **Add Books**: Form to add new books to the store
- **Edit Books**: Update book information inline
- **Delete Books**: Remove books from the store
- **Responsive Design**: Works on desktop, tablet, and mobile

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The application will be available at **http://localhost:5173**

### 3. Build for production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Prerequisites

Make sure the backend API is running on http://localhost:3001 before starting the frontend.

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── BookList.jsx         # Grid of book cards
│   │   ├── BookDetail.jsx       # Book detail modal
│   │   ├── SearchBar.jsx        # Search and filter bar
│   │   └── AddBookForm.jsx      # Form to add new books
│   ├── services/
│   │   └── bookService.js       # API calls to backend
│   ├── App.jsx          # Main app component
│   ├── App.css          # Global styles
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## Components

### BookList
Displays books in a grid layout. Each card shows:
- Book cover (or placeholder)
- Title and author
- Category and publication year
- Price and stock status

### BookDetail
Modal that shows complete book information:
- All book details
- Edit mode for updating book information
- Delete button

### SearchBar
Provides filtering capabilities:
- Text search (searches title and description)
- Category dropdown
- Author filter
- Reset button to clear all filters

### AddBookForm
Form to add new books with validation:
- Required fields: Title, Author, ISBN, Price
- Optional fields: Category, Description, Year, Publisher, Stock, Cover Image
- Client-side validation

## API Integration

The frontend communicates with the backend API using the `bookService`:

```javascript
// Get all books
await bookService.getAllBooks()

// Get all books with filters
await bookService.getAllBooks({ 
  category: 'Fiction', 
  author: 'Tolkien',
  search: 'wizard'
})

// Get single book
await bookService.getBookById(1)

// Create book
await bookService.createBook(bookData)

// Update book
await bookService.updateBook(1, bookData)

// Delete book
await bookService.deleteBook(1)
```

## Testing the Frontend

### Manual Testing

1. **Browse Books**: Verify all books display correctly
2. **Search**: Try searching for keywords
3. **Filter**: Use category and author filters
4. **View Details**: Click on a book card
5. **Add Book**: Click "+ Add Book" and submit the form
6. **Edit Book**: Open book details and click "Edit Book"
7. **Delete Book**: Open book details and click "Delete Book"

### Test Data Attributes

Components include `data-testid` attributes for automated testing:
- `book-card-{id}`: Individual book cards
- `search-input`: Search text input
- `category-filter`: Category dropdown
- `author-filter`: Author filter input
- `search-button`: Search button
- `reset-button`: Reset filters button
- `input-{field}`: Form inputs (e.g., `input-title`, `input-author`)
- `submit-button`: Form submit button

### Example Test Scenarios

**Search Functionality**
```
1. Enter "wizard" in search box
2. Click search button
3. Verify only books with "wizard" in title/description appear
```

**Add Book**
```
1. Click "+ Add Book" button
2. Fill in all required fields
3. Click "Add Book"
4. Verify book appears in the list
```

**Edit Book**
```
1. Click on any book card
2. Click "Edit Book"
3. Change the price
4. Click "Save Changes"
5. Verify price is updated
```

## Development

### Hot Module Replacement (HMR)

Vite provides fast HMR. Any changes to React components will be reflected instantly without losing component state.

### Proxy Configuration

The Vite dev server proxies `/api` requests to the backend on `http://localhost:3001`. This avoids CORS issues during development.

### Adding New Features

To add a new component:

1. Create component file in `src/components/`
2. Create corresponding CSS file
3. Import in `App.jsx`
4. Add any needed API calls to `bookService.js`

## Styling

The application uses vanilla CSS with:
- CSS Grid for layouts
- Flexbox for component alignment
- CSS animations for smooth transitions
- Responsive design with media queries
- Modern color palette and shadows

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Common Issues

**Backend not running**
- Error: "Failed to load books"
- Solution: Start the backend server on port 3001

**Port already in use**
- Error: "Port 5173 is already in use"
- Solution: Kill the process using port 5173 or change the port in `vite.config.js`

**Books not updating after API call**
- Solution: Check browser console for errors
- Verify backend API is responding correctly at http://localhost:3001/api/books
