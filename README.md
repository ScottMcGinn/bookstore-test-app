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
  - **Customer**: Browse books, add to cart, checkout, view orders
  - **Store Staff**: Manage books (add/edit/delete), view analytics
  - **Admin**: Full system access, manage staff and users
  - Admin: `admin` / `admin123`
  - Staff: `staff` / `staff123`
  - Customer: `customer` / `customer123`


### Backend API
- Full CRUD operations for books
- Search and filter capabilities
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
- **File System (fs)** - JSON data persistence

### Frontend
- **React 18** - UI library with Hooks
- **React Context API** - State management (Cart, Auth)
- **Vite** - Build tool and dev server
- **Vanilla CSS** - Styling with responsive design
- **Local Storage** - Session persistence

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

Here are comprehensive test cases you can automate:

### Authentication & Authorization
1. **Test login with valid credentials**
2. **Test login with invalid credentials**
3. **Test login form validation (empty fields)**
4. **Test user registration with valid data**
5. **Test registration form validation (empty fields, invalid email)**
6. **Test password confirmation matching in registration**
7. **Test session persistence after page refresh**
8. **Test logout functionality**
9. **Verify customer role sees customer features only**
10. **Verify staff role sees staff features (books + stock management)**
11. **Verify admin role sees all features**
12. **Test non-authenticated users are redirected to login**
13. **Test role-protected features are hidden based on user role**

### Book Management & Catalog
14. **Verify all books load correctly on initial page load**
15. **Test search functionality with various keywords**
16. **Test category filtering with multiple categories**
17. **Test author filtering**
18. **Test combined search + category filters**
19. **Verify books count updates with filters**
20. **Add a new book with complete details**
21. **Verify newly added book appears in list**
22. **Edit a book and verify changes persist**
23. **Delete a book and verify it's removed from list**
24. **Test book form validation (empty required fields)**
25. **Test invalid price input (negative numbers)**
26. **Test invalid stock input (negative numbers)**
27. **Verify book details modal opens correctly**
28. **Verify book details display all information**

### Shopping Cart
29. **Add single book to cart and verify badge updates**
30. **Verify cart badge shows correct item count**
31. **Add multiple different books to cart**
32. **Increase quantity of item in cart**
33. **Decrease quantity of item in cart**
34. **Set specific quantity in cart**
35. **Remove item from cart and verify total updates**
36. **Clear entire cart**
37. **Verify cart items persist when navigating away and back**
38. **Verify cart subtotal is calculated correctly**
39. **Verify cart shows correct number of items**
40. **Verify cart button shows/hides based on state**

### Checkout & Payment
41. **Complete full checkout flow from cart to confirmation**
42. **Validate shipping form required field validation**
43. **Test invalid email format rejection**
44. **Verify street address is required**
45. **Verify city is required**
46. **Verify state is required**
47. **Verify zip code is required**
48. **Verify country is required**
49. **Verify credit card number formatting (spaces every 4 digits)**
50. **Verify expiry date formatting (MM/YY)**
51. **Verify CVV only accepts digits**
52. **Test invalid credit card number rejection**
53. **Test invalid credit card length rejection**
54. **Test expired credit card rejection**
55. **Verify CVV length validation (3-4 digits)**
56. **Complete order and verify confirmation page displays**
57. **Verify order ID is generated and displayed**
58. **Verify order date is displayed**
59. **Verify order summary shows correct items and total**
60. **Verify order total is calculated correctly (items + shipping + tax)**
61. **Click "Back to Home" and verify cart is cleared**

### User Profile & Order Management
62. **Login and open profile modal**
63. **Verify profile information displays correctly**
64. **Edit profile first name and verify changes persist**
65. **Edit profile last name and verify changes persist**
66. **Edit profile email and verify changes persist**
67. **Test profile form field validation (required fields)**
68. **View payment methods tab**
69. **Add new payment method with valid data**
70. **Verify newly added payment method appears in list**
71. **Set payment method as default**
72. **Verify default payment method is marked as default**
73. **Delete payment method**
74. **Verify deleted payment method is removed from list**
75. **View order history tab**
76. **Verify all orders display in order history**
77. **Verify order summary shows order number, date, total**
78. **Expand order and verify detailed information displays**
79. **Verify order items show title, author, quantity, price**
80. **Verify order status is displayed correctly**
81. **Verify order summary calculations (subtotal, tax, shipping, total)**
82. **Test Download Invoice button functionality**
83. **Create new order and verify it appears in order history**
84. **Verify new order displays with "pending" status**
85. **Test Reorder button functionality**
86. **Verify modal close functionality**
87. **Verify tab switching in profile modal**

### Stock Management (Staff/Admin)
88. **View stocktake page**
89. **Verify all books display with current stock levels**
90. **Filter books in stocktake view**
91. **Verify stock levels update when books are added**
92. **Verify stock levels update when books are sold**
93. **View low stock warnings (if implemented)**
94. **Sort by stock level**

### User Management (Admin Only)
95. **Access user management page**
96. **View all users in system**
97. **Filter users by role**
98. **View user details**
99. **Add new staff member**
100. **Verify new staff member is created with correct role**
101. **Edit user information**
102. **Deactivate user account**
103. **View user order history**

### API Testing
104. **Test GET /api/books endpoint**
105. **Test GET /api/books/:id endpoint**
106. **Test POST /api/books with valid data**
107. **Test POST /api/books with invalid data**
108. **Test PUT /api/books/:id for updates**
109. **Test DELETE /api/books/:id**
110. **Test query parameters (?category=Fiction&author=...)**
111. **Test API response codes (200, 201, 404, 400)**
112. **Test GET /api/auth/login with valid credentials**
113. **Test POST /api/auth/login with invalid credentials**
114. **Test POST /api/auth/register**
115. **Test GET /api/users/:id/profile endpoint**
116. **Test PUT /api/users/:id/profile endpoint**
117. **Test GET /api/users/:id/orders endpoint**
118. **Test POST /api/users/:id/orders endpoint**
119. **Test GET /api/users/:id/payment-methods endpoint**
120. **Test POST /api/users/:id/payment-methods endpoint**
121. **Test DELETE /api/users/:id/payment-methods/:methodId endpoint**
122. **Test API authentication (invalid/missing tokens)**
123. **Test API rate limiting (if implemented)**

### UI/UX Testing
124. **Test responsive design on mobile devices (320px width)**
125. **Test responsive design on tablets (768px width)**
126. **Test responsive design on desktop (1024px+ width)**
127. **Test button hover states**
128. **Test form input focus states**
129. **Test modal animation and transitions**
130. **Test profile modal opens and closes correctly**
131. **Test cart modal opens and closes correctly**
132. **Test checkout modal opens and closes correctly**
133. **Test dropdown menus work correctly**
134. **Test expandable order details in order history**
135. **Verify all navigation links work correctly**
136. **Test keyboard navigation and accessibility**
137. **Test tab key navigation through forms**
138. **Test Enter key submits forms**
139. **Test Escape key closes modals**
140. **Verify ARIA labels on all interactive elements**
141. **Test screen reader announcements for cart updates**
142. **Test form error messages display correctly**
143. **Test success messages display after actions**
144. **Verify loading spinner displays during API calls**

### Edge Cases & Error Handling
145. **Test behavior with network disconnection**
146. **Test behavior with slow network**
147. **Test simultaneous actions (add to cart while ordering)**
148. **Test duplicate book additions**
149. **Test cart with no items checkout attempt**
150. **Test user logout during checkout**
151. **Test browser back button during checkout**
152. **Test invalid data in localStorage**
153. **Test empty search results**
154. **Test special characters in search**
155. **Test very long book titles/descriptions**
156. **Test concurrent user actions**
157. **Test database update conflicts**

### Performance Testing
158. **Verify page load time with full book catalog**
159. **Verify search response time**
160. **Verify cart updates are responsive**
161. **Verify modal open/close animations are smooth**
162. **Monitor memory usage during extended session**
163. **Test with large number of orders in history**

### Security Testing
164. **Test SQL injection in search field**
165. **Test XSS attempts in form fields**
166. **Verify sensitive data not exposed in console**
167. **Verify payment data not logged or exposed**
168. **Test CORS restrictions**
169. **Test unauthorized API access**
170. **Verify session tokens are secure**

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
