# Backend API

Express.js backend for the bookstore application with Swagger documentation.

## Features

- RESTful API for book management (CRUD operations)
- JSON file-based database (easy to reset and modify)
- Swagger/OpenAPI documentation
- CORS enabled for frontend integration
- Search and filter capabilities
- Input validation and error handling

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The API will be available at **http://localhost:3001**

## API Endpoints

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books (supports filtering) |
| GET | `/api/books/:id` | Get a specific book by ID |
| POST | `/api/books` | Create a new book |
| PUT | `/api/books/:id` | Update an existing book |
| DELETE | `/api/books/:id` | Delete a book |

### Query Parameters for GET /api/books

- `category` - Filter by category (e.g., Fiction, Fantasy)
- `author` - Filter by author name (partial match)
- `search` - Search in title and description

**Examples:**
```
GET /api/books?category=Fiction
GET /api/books?author=Tolkien
GET /api/books?search=wizard
```

## API Documentation

Interactive Swagger documentation is available at:
**http://localhost:3001/api-docs**

You can test all endpoints directly from the Swagger UI.

## Database

The database is a simple JSON file located at `data/books.json`. 

To reset the database, simply restore the original content or modify the JSON file directly.

### Sample Book Object

```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "price": 15.99,
  "category": "Fiction",
  "description": "A classic American novel",
  "publicationYear": 1925,
  "publisher": "Scribner",
  "stock": 25,
  "coverImage": "https://example.com/image.jpg"
}
```

## Testing the API

### Using cURL

```bash
# Get all books
curl http://localhost:3001/api/books

# Get a specific book
curl http://localhost:3001/api/books/1

# Create a new book
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book",
    "author": "Test Author",
    "isbn": "978-1-234-56789-0",
    "price": 19.99,
    "category": "Fiction",
    "stock": 10
  }'

# Update a book
curl -X PUT http://localhost:3001/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 12.99}'

# Delete a book
curl -X DELETE http://localhost:3001/api/books/1
```

### Using the Swagger UI

1. Navigate to http://localhost:3001/api-docs
2. Click on any endpoint to expand it
3. Click "Try it out"
4. Fill in the required parameters
5. Click "Execute"

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Server Error

Error responses include a JSON object with an `error` message:
```json
{
  "error": "Book not found"
}
```

## Project Structure

```
backend/
├── config/
│   └── swagger.js          # Swagger/OpenAPI configuration
├── data/
│   └── books.json          # JSON database
├── routes/
│   └── books.js            # Book routes and handlers
├── server.js               # Main server file
├── package.json            # Dependencies
└── README.md              # This file
```
