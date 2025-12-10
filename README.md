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

### Frontend - Authentication & User Roles
- **Login Page** - Beautiful gradient design with demo credentials displayed
- **Three User Roles:**
  - **Customer**: Browse books, add to cart, checkout, view orders
  - **Store Staff**: Manage books (add/edit/delete), view analytics
  - **Admin**: Full system access, manage staff and users
- **Session Management** - User sessions persisted in localStorage
- **Role-Based Access Control (RBAC)** - Features restricted by user role
- **Demo Accounts** - Pre-configured test accounts for easy testing:
  - Admin: `admin` / `admin123`
  - Staff: `staff` / `staff123`
  - Customer: `customer` / `customer123`

### Backend API
- Full CRUD operations for books
- Search and filter capabilities
- Interactive Swagger documentation
- Authentication endpoints (`/api/auth/login`, `/api/auth/logout`)
- JSON file-based database (easy to reset)
- Comprehensive error handling

### Frontend - Book Management
- Modern React interface with responsive design (mobile, tablet, desktop)
- Book browsing with grid layout
- Advanced search and filtering by title, author, and category
- Add, edit, and delete books (staff/admin only)
- Modal-based book details with full information display
- Stock availability indicators

### Frontend - Shopping Cart
- Add books to cart from book list or detail view (customers only)
- Real-time cart badge showing item count
- Side cart panel with:
  - Item quantity controls
  - Individual item removal
  - Subtotal calculations
  - Clear cart option
  - Continue shopping button

### Frontend - Checkout & Payment Processing
- **Two-step checkout process (customers only):**
  1. **Shipping Information** - Collect customer details (name, email, phone, address, city, state, zip, country)
  2. **Payment Information** - Collect credit card details with smart formatting
- **Payment Input Formatting:**
  - Credit Card: `#### #### #### ####` (auto-formats with spaces)
  - Expiry Date: `##/##` (MM/YY format with auto-formatting)
  - CVV: `###` (3 digits only)
- **Form Validation:**
  - Required field validation
  - Email format validation
  - Credit card length validation
  - Real-time error messages
- **Order Confirmation Page:**
  - Thank you message
  - Auto-generated order number
  - Order details summary
  - Shipping and billing information
  - Itemized order breakdown
  - Confirmation email notification
  - Link back to home page

### Frontend - Customer Profile & Order Management
- **User Profile Modal** - Access via Profile button in header
- **Three Profile Tabs:**
  1. **Profile Info** - View and edit personal information
     - Name, email, phone, address (city, state, zip, country)
     - Edit button to update profile
     - Persistent storage in backend
  2. **Payment Methods** - Manage saved payment methods
     - View saved credit cards
     - Add new payment method
     - Set default payment method
     - Delete payment methods
  3. **Order History** - Complete order tracking
     - View all customer orders with status (pending, processing, shipped, delivered)
     - Order summary card showing order number, date, total, items preview
     - Expandable order details showing:
       - Complete item list with quantities and prices
       - Order summary with subtotal, shipping, tax, total
       - Reorder button to quickly reorder items
       - Download invoice button
     - Real-time order updates from backend
     - Proper date formatting (e.g., "December 10, 2025")

### Backend - Order Management API
- **Order CRUD Endpoints:**
  - `GET /api/users/:id/orders` - Retrieve user's complete order history
  - `POST /api/users/:id/orders` - Create new order with full details
  - Orders stored with complete structure: orderId, orderDate, total, items, status, shippingAddress
  - Automatic order persistence to backend database
  - Order data includes book details (title, author, price, quantity)
- **User Profile Endpoints:**
  - `GET /api/users/:id/profile` - Get user profile information
  - `PUT /api/users/:id/profile` - Update user profile
- **Payment Methods Endpoints:**
  - `GET /api/users/:id/payment-methods` - Get saved payment methods
  - `POST /api/users/:id/payment-methods` - Save new payment method
  - `DELETE /api/users/:id/payment-methods/:methodId` - Remove payment method


## 📁 Project Structure

```
bookstore-test-app/
├── backend/              # Express.js API
│   ├── config/          # Swagger configuration
│   ├── data/            # JSON database
│   │   ├── books.json   # Books database
│   │   └── users.json   # User accounts database
│   ├── routes/          # API routes
│   │   ├── books.js     # Book CRUD endpoints
│   │   └── auth.js      # Authentication endpoints
│   └── server.js        # Main server file
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── LoginPage.jsx         # Login/authentication page
│   │   │   ├── BookList.jsx          # Book grid display
│   │   │   ├── BookDetail.jsx        # Book details modal
│   │   │   ├── SearchBar.jsx         # Search and filter
│   │   │   ├── AddBookForm.jsx       # Add/edit book form
│   │   │   ├── Cart.jsx              # Shopping cart panel
│   │   │   ├── Checkout.jsx          # Checkout modal (2-step)
│   │   │   ├── OrderConfirmation.jsx # Order confirmation page
│   │   │   ├── CustomerProfile.jsx   # User profile modal
│   │   │   ├── ProfileInfo.jsx       # Profile information tab
│   │   │   ├── PaymentMethods.jsx    # Payment methods management
│   │   │   ├── OrderHistory.jsx      # Order history and tracking
│   │   │   └── RoleProtected.jsx     # Role-based access wrapper
│   │   ├── context/     # React Context
│   │   │   ├── CartContext.jsx       # Global cart state
│   │   │   └── AuthContext.jsx       # Global authentication state
│   │   ├── services/    # API service layer
│   │   │   ├── bookService.js        # Book API calls
│   │   │   └── userService.js        # User profile, orders, payment API calls
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point with AuthProvider & CartProvider
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

### Book Endpoints
| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/api/books` | Get all books | `?category=Fiction&author=Tolkien&search=wizard` |
| GET | `/api/books/:id` | Get specific book | - |
| POST | `/api/books` | Create new book | - |
| PUT | `/api/books/:id` | Update book | - |
| DELETE | `/api/books/:id` | Delete book | - |

### User Profile Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id/profile` | Get user profile information |
| PUT | `/api/users/:id/profile` | Update user profile |

### Order Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id/orders` | Get user's complete order history |
| POST | `/api/users/:id/orders` | Create new order |

### Payment Methods Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id/payment-methods` | Get saved payment methods |
| POST | `/api/users/:id/payment-methods` | Save new payment method |
| DELETE | `/api/users/:id/payment-methods/:methodId` | Delete payment method |


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
- Test CRUD operations for books
- Validate request/response formats
- Test error handling (404, 400, 500)
- Test query parameters and filtering
- Verify data persistence

### UI Testing - Book Management
- Test search functionality with various keywords
- Test filtering by category and author
- Test form validation (empty fields, invalid data)
- Test CRUD operations through UI
- Test responsive design across devices

### UI Testing - Shopping Cart
- Add single and multiple books to cart
- Update item quantities
- Remove individual items from cart
- Clear entire cart
- Verify cart badge updates correctly
- Check total price calculations
- Continue shopping after viewing cart

### UI Testing - Checkout & Payment
- Complete checkout flow from start to finish
- Validate shipping information form
- Verify form field validation and error messages
- Test payment information input formatting
- Validate credit card, expiry, and CVV inputs
- Complete order placement
- Verify order confirmation page displays correctly
- Confirm "Back to Home" navigation works
- Verify cart is cleared after successful order

### UI Testing - User Profile & Order Management
- Access profile modal via Profile button
- **Profile Info Tab:**
  - View personal information
  - Edit profile information
  - Verify updates persist
  - Test form validation
- **Payment Methods Tab:**
  - Add new payment method
  - View saved payment methods
  - Set default payment method
  - Delete payment methods
- **Order History Tab:**
  - View all customer orders
  - Verify order information displays correctly (order number, date, total, status)
  - Expand order to view detailed information
  - Verify order items display with correct quantities and prices
  - Verify order summary calculations (subtotal, shipping, tax, total)
  - Test Reorder button functionality
  - Test Download Invoice button
  - Verify newly created orders appear in history

### End-to-End Testing
- Complete shopping workflow: Browse → Search → Add to Cart → Checkout → Confirmation
- Book management flow: Create → View → Edit → Delete
- Error state handling throughout application
- Navigation between all application sections
- Responsive behavior on different screen sizes

### Performance Testing
- API response times
- Frontend load times
- Cart performance with many items
- Checkout form responsiveness
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
- **React 18** - UI library with Hooks
- **React Context API** - State management
- **Vite** - Build tool and dev server
- **Vanilla CSS** - Styling with responsive design

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

## 📝 Test Automation Ideas

Here are some test cases you can automate:

### Book Management
1. **Verify all books load correctly on initial page load**
2. **Test search functionality with various keywords**
3. **Test category filtering with multiple categories**
4. **Test author filtering**
5. **Add a new book and verify it appears in the list**
6. **Edit a book and verify changes persist**
7. **Delete a book and verify it's removed**
8. **Test form validation (empty fields, invalid data)**

### Shopping Cart
9. **Add single book to cart and verify badge updates**
10. **Add multiple different books to cart**
11. **Increase quantity of item in cart**
12. **Remove item from cart and verify total updates**
13. **Clear entire cart**
14. **Verify cart items persist when navigating away and back**
15. **Verify total price calculations are accurate**

### Checkout & Payment
16. **Complete full checkout flow from cart to confirmation**
17. **Validate shipping form required field validation**
18. **Test invalid email format rejection**
19. **Verify credit card number formatting (spaces every 4 digits)**
20. **Verify expiry date formatting (MM/YY)**
21. **Verify CVV only accepts digits**
22. **Test invalid credit card length rejection**
23. **Complete order and verify confirmation page displays**
24. **Verify order number is generated**
25. **Verify order summary shows correct items and total**
26. **Click "Back to Home" and verify cart is cleared**

### User Profile & Order Management
27. **Open profile modal and verify all tabs load**
28. **Verify profile information displays correctly**
29. **Edit profile information and verify changes persist**
30. **Test profile form field validation**
31. **View payment methods tab**
32. **Add new payment method**
33. **Set payment method as default**
34. **Delete payment method**
35. **View order history tab**
36. **Verify all orders display in order history**
37. **Verify order summary shows correct order number, date, total**
38. **Expand order and verify detailed information displays**
39. **Verify order items show title, author, quantity, price**
40. **Verify order summary calculations (subtotal, shipping, tax, total)**
41. **Test Reorder button functionality**
42. **Test Download Invoice button**
43. **Create new order and verify it appears in order history**
44. **Verify new order displays with "pending" status**

### API Testing
45. **Test GET /api/books endpoint**
46. **Test GET /api/books/:id endpoint**
47. **Test POST /api/books with valid data**
48. **Test POST /api/books with invalid data**
49. **Test PUT /api/books/:id for updates**
50. **Test DELETE /api/books/:id**
51. **Test query parameters (?category=Fiction&author=...)**
52. **Test API response codes (200, 201, 404, 400)**
53. **Test GET /api/users/:id/profile endpoint**
54. **Test PUT /api/users/:id/profile endpoint**
55. **Test GET /api/users/:id/orders endpoint**
56. **Test POST /api/users/:id/orders endpoint**
57. **Test GET /api/users/:id/payment-methods endpoint**
58. **Test POST /api/users/:id/payment-methods endpoint**
59. **Test DELETE /api/users/:id/payment-methods/:methodId endpoint**

### UI/UX Testing
60. **Test responsive design on mobile devices**
61. **Test responsive design on tablets**
62. **Test responsive design on desktop**
63. **Test button hover states**
64. **Test form input focus states**
65. **Test modal close functionality**
66. **Test profile modal opens and closes correctly**
67. **Test tab switching in profile modal**
68. **Test expandable order details in order history**
69. **Verify all navigation links work correctly**
70. **Test keyboard navigation and accessibility**

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
