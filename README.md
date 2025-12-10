# Bookstore Test Automation Practice App

A full-stack bookstore application designed for test automation practice. This project includes a React frontend, Node.js/Express API backend, and a local database.

## Project Structure

```
bookstore-test-app/
├── frontend/          # React application
├── backend/           # Node.js/Express API
└── README.md          # This file
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/bookstore-test-app.git
cd bookstore-test-app
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Run the application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
The API will run on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:5173

### 4. Access the application

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs

## Features

### API Endpoints
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Frontend Features
- Browse books
- Search and filter
- View book details
- Shopping cart (coming soon)

## Testing

This application is designed for test automation practice. You can test:
- REST API endpoints
- UI interactions
- End-to-end workflows
- Performance
- Security

## Technologies Used

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: JSON file storage (SQLite coming soon)
- **API Documentation**: Swagger/OpenAPI

## Contributing

This is a practice project for test automation. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License

MIT
