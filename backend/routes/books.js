const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const booksFilePath = path.join(__dirname, '../data/books.json');

// Helper function to read books from file
async function readBooks() {
  try {
    const data = await fs.readFile(booksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading books:', error);
    return [];
  }
}

// Helper function to write books to file
async function writeBooks(books) {
  try {
    await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing books:', error);
    return false;
  }
}

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     description: Retrieve a list of all books in the store. Supports filtering by category, author, and search term.
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author name
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', async (req, res) => {
  try {
    let books = await readBooks();
    
    // Filter by category
    if (req.query.category) {
      books = books.filter(book => 
        book.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }
    
    // Filter by author
    if (req.query.author) {
      books = books.filter(book => 
        book.author.toLowerCase().includes(req.query.author.toLowerCase())
      );
    }
    
    // Search in title and description
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      books = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books' });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Retrieve a specific book by its ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
  try {
    const books = await readBooks();
    const book = books.find(b => b.id === parseInt(req.params.id));
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve book' });
  }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     description: Add a new book to the store
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - isbn
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               publicationYear:
 *                 type: integer
 *               publisher:
 *                 type: string
 *               stock:
 *                 type: integer
 *               coverImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, price, category, description, publicationYear, publisher, stock, coverImage } = req.body;
    
    // Validation
    if (!title || !author || !isbn || !price) {
      return res.status(400).json({ error: 'Missing required fields: title, author, isbn, price' });
    }
    
    const books = await readBooks();
    
    // Check for duplicate ISBN
    const existingBook = books.find(b => b.isbn === isbn);
    if (existingBook) {
      return res.status(400).json({ error: 'A book with this ISBN already exists' });
    }
    
    // Generate new ID
    const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    
    const newBook = {
      id: newId,
      title,
      author,
      isbn,
      price: parseFloat(price),
      category: category || 'Uncategorized',
      description: description || '',
      publicationYear: publicationYear ? parseInt(publicationYear) : null,
      publisher: publisher || '',
      stock: stock ? parseInt(stock) : 0,
      coverImage: coverImage || ''
    };
    
    books.push(newBook);
    await writeBooks(books);
    
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book' });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     description: Update an existing book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               publicationYear:
 *                 type: integer
 *               publisher:
 *                 type: string
 *               stock:
 *                 type: integer
 *               coverImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', async (req, res) => {
  try {
    const books = await readBooks();
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Update book with provided fields
    const updatedBook = {
      ...books[bookIndex],
      ...req.body,
      id: books[bookIndex].id // Ensure ID doesn't change
    };
    
    // Convert numeric fields
    if (updatedBook.price) updatedBook.price = parseFloat(updatedBook.price);
    if (updatedBook.stock) updatedBook.stock = parseInt(updatedBook.stock);
    if (updatedBook.publicationYear) updatedBook.publicationYear = parseInt(updatedBook.publicationYear);
    
    books[bookIndex] = updatedBook;
    await writeBooks(books);
    
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     description: Remove a book from the store by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Book deleted successfully
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', async (req, res) => {
  try {
    const books = await readBooks();
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    books.splice(bookIndex, 1);
    await writeBooks(books);
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

module.exports = router;
