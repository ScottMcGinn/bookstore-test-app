const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookstore API',
      version: '1.0.0',
      description: 'A simple bookstore API for test automation practice',
      contact: {
        name: 'API Support',
        email: 'support@bookstore.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Book: {
          type: 'object',
          required: ['title', 'author', 'isbn', 'price'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated book ID',
              example: 1
            },
            title: {
              type: 'string',
              description: 'Book title',
              example: 'The Great Gatsby'
            },
            author: {
              type: 'string',
              description: 'Book author',
              example: 'F. Scott Fitzgerald'
            },
            isbn: {
              type: 'string',
              description: 'ISBN number',
              example: '978-0-7432-7356-5'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Book price',
              example: 15.99
            },
            category: {
              type: 'string',
              description: 'Book category',
              example: 'Fiction'
            },
            description: {
              type: 'string',
              description: 'Book description',
              example: 'A classic American novel'
            },
            publicationYear: {
              type: 'integer',
              description: 'Year of publication',
              example: 1925
            },
            publisher: {
              type: 'string',
              description: 'Publisher name',
              example: 'Scribner'
            },
            stock: {
              type: 'integer',
              description: 'Number of books in stock',
              example: 25
            },
            coverImage: {
              type: 'string',
              description: 'URL to cover image',
              example: 'https://example.com/image.jpg'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
              example: 'user_1701234567_abc123'
            },
            username: {
              type: 'string',
              description: 'Username',
              example: 'customer'
            },
            email: {
              type: 'string',
              description: 'Email address',
              example: 'customer@bookstore.com'
            },
            fullName: {
              type: 'string',
              description: 'Full name',
              example: 'John Doe'
            },
            firstName: {
              type: 'string',
              example: 'John'
            },
            lastName: {
              type: 'string',
              example: 'Doe'
            },
            role: {
              type: 'string',
              enum: ['customer', 'staff', 'admin'],
              description: 'User role',
              example: 'customer'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            orderId: {
              type: 'string',
              description: 'Order ID',
              example: 'ORD-1701234567-abc123'
            },
            orderDate: {
              type: 'string',
              format: 'date-time',
              description: 'Order date'
            },
            total: {
              type: 'number',
              description: 'Order total',
              example: 49.97
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  bookId: { type: 'integer' },
                  title: { type: 'string' },
                  author: { type: 'string' },
                  price: { type: 'number' },
                  quantity: { type: 'integer' }
                }
              }
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered'],
              example: 'pending'
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            }
          }
        },
        PaymentMethod: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Payment method ID'
            },
            cardholderName: {
              type: 'string'
            },
            cardNumber: {
              type: 'string',
              description: 'Last 4 digits of card',
              example: '****1234'
            },
            expiryDate: {
              type: 'string',
              description: 'Expiry date MM/YY',
              example: '12/25'
            },
            isDefault: {
              type: 'boolean',
              example: false
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            success: {
              type: 'boolean',
              example: false
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
