# Bookstore Test Automation Practice App

A full-stack bookstore application designed for test automation practice. This project includes a React frontend, Node.js/Express API backend, and a local JSON database.

## 🎯 Purpose

This application is specifically designed for software testers to practice:
- REST API testing
- UI automation testing
- End-to-end testing
- Performance testing
- Integration testing

## ✨ Features

### Backend API
- Full CRUD operations for books
- Search and filter capabilities
- Interactive Swagger documentation
- JSON file-based database (easy to reset)
- Comprehensive error handling

### Frontend
- Modern React interface
- Responsive design (mobile, tablet, desktop)
- Book browsing with grid layout
- Advanced search and filtering
- Add, edit, and delete books
- Modal-based book details

## 📁 Project Structure

```
bookstore-test-app/
├── backend/              # Express.js API
│   ├── config/          # Swagger configuration
│   ├── data/            # JSON database
│   ├── routes/          # API routes
│   └── server.js        # Main server file
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API service layer
│   │   └── App.jsx      # Main app component
│   └── vite.config.js   # Vite configuration
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/bookstore-test-app.git
cd bookstore-test-app
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Start the Application

You'll need two terminal windows:

#### Terminal 1 - Start Backend
```bash
cd backend
npm start
```

The API will be running at: **http://localhost:3001**

#### Terminal 2 - Start Frontend
```bash
cd frontend
npm run dev
```

The frontend will be running at: **http://localhost:5173**

### 4. Access the Application

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:3001/api/books
- **API Documentation**: http://localhost:3001/api-docs

## 📚 API Endpoints

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/api/books` | Get all books | `?category=Fiction&author=Tolkien&search=wizard` |
| GET | `/api/books/:id` | Get specific book | - |
| POST | `/api/books` | Create new book | - |
| PUT | `/api/books/:id` | Update book | - |
| DELETE | `/api/books/:id` | Delete book | - |

### Sample API Request

```bash
# Get all Fiction books
curl "http://localhost:3001/api/books?category=Fiction"

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
```

## 🧪 Testing Scenarios

This application is designed with various testing scenarios in mind:

### API Testing
- Test CRUD operations
- Validate request/response formats
- Test error handling (404, 400, 500)
- Test query parameters and filtering
- Verify data persistence

### UI Testing
- Test search functionality
- Test filtering (category, author)
- Test form validation
- Test CRUD operations through UI
- Test responsive design

### End-to-End Testing
- Complete user workflows
- Book creation flow
- Search → View → Edit → Delete flow
- Error state handling

### Performance Testing
- API response times
- Frontend load times
- Concurrent user handling

## 🔧 Configuration

### Backend Port
Default: `3001`

To change, edit `backend/server.js` or set environment variable:
```bash
PORT=3002 npm start
```

### Frontend Port
Default: `5173`

To change, edit `frontend/vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

## 📊 Database

The application uses a simple JSON file (`backend/data/books.json`) as its database.

### Initial Data
The database comes pre-populated with 10 sample books across various genres.

### Reset Database
To reset the database to its initial state, restore the original content of `backend/data/books.json`.

### Sample Book Structure
```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "price": 15.99,
  "category": "Fiction",
  "description": "A classic American novel...",
  "publicationYear": 1925,
  "publisher": "Scribner",
  "stock": 25,
  "coverImage": "https://example.com/image.jpg"
}
```

## 🎨 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Swagger UI** - API documentation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Vanilla CSS** - Styling

## 🐛 Common Issues

### Backend won't start
**Error**: `Cannot find module 'express'`
**Solution**: Run `npm install` in the backend directory

### Frontend shows "Failed to load books"
**Error**: Connection refused
**Solution**: Make sure the backend is running on port 3001

### Port already in use
**Error**: `EADDRINUSE: address already in use`
**Solution**: Kill the process using the port or change the port number

### Books not updating
**Solution**: Check that both frontend and backend are running and can communicate

## 🤝 Contributing

This is a practice project for test automation. Contributions are welcome!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

### Ideas for Contributions
- Add authentication
- Add shopping cart functionality
- Add user reviews and ratings
- Add book categories management
- Add SQLite database option
- Add Docker configuration
- Add automated tests
- Add CI/CD pipeline

## 📝 Test Automation Ideas

Here are some test cases you can automate:

1. **Verify all books load correctly**
2. **Test search functionality with various keywords**
3. **Test category filtering**
4. **Add a new book and verify it appears in the list**
5. **Edit a book and verify changes persist**
6. **Delete a book and verify it's removed**
7. **Test form validation (empty fields, invalid data)**
8. **Test API response codes (200, 201, 404, 400)**
9. **Test pagination if you add it**
10. **Performance test with multiple concurrent users**

## 📄 License

MIT License - See LICENSE file for details

## 🙋 Support

For issues or questions:
- Open an issue on GitHub
- Check the backend and frontend README files for detailed documentation

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Swagger Documentation](https://swagger.io/docs/)
- [Vite Documentation](https://vitejs.dev/)

---

**Happy Testing! 🧪**
