const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const booksRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Bookstore API Documentation'
}));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Bookstore API',
    version: '1.0.0',
    endpoints: {
      books: '/api/books',
      documentation: '/api-docs'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     Bookstore API Server Started      ║
╚════════════════════════════════════════╝

🚀 Server running on: http://localhost:${PORT}
📚 API Endpoints: http://localhost:${PORT}/api/books
📖 API Documentation: http://localhost:${PORT}/api-docs
💚 Health Check: http://localhost:${PORT}/health

Press Ctrl+C to stop the server
  `);
});

module.exports = app;
