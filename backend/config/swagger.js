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
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
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
