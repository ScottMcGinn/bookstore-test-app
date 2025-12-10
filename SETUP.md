# Quick Setup Guide

## For Windows Users

### First Time Setup

1. **Open PowerShell or Command Prompt**

2. **Navigate to the project folder**
   ```bash
   cd D:\Documents\bookstore-test-app
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd ..\frontend
   npm install
   ```

### Running the Application

You need to run TWO terminals:

#### Terminal 1: Backend
```bash
cd D:\Documents\bookstore-test-app\backend
npm start
```

Wait until you see: "Server running on: http://localhost:3001"

#### Terminal 2: Frontend
```bash
cd D:\Documents\bookstore-test-app\frontend
npm run dev
```

Wait until you see: "Local: http://localhost:5173"

### Open in Browser

Navigate to: http://localhost:5173

### Verify Everything Works

1. You should see the bookstore homepage with 10 books
2. Try searching for "wizard"
3. Try clicking "+ Add Book"
4. Try clicking on a book to see details

## For Mac/Linux Users

### First Time Setup

```bash
cd /path/to/bookstore-test-app

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### Running the Application

#### Terminal 1: Backend
```bash
cd backend
npm start
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

## Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "Port 3001 is already in use"
- Another application is using port 3001
- Kill the process or change the port in backend/server.js

### "Port 5173 is already in use"
- Kill the process or change the port in frontend/vite.config.js

### Backend starts but no books appear
- Open http://localhost:3001/api/books in your browser
- You should see JSON data with books
- If not, check that backend/data/books.json exists

### "Failed to fetch books"
- Make sure backend is running FIRST
- Check http://localhost:3001/health to verify backend is up
- Check browser console (F12) for error messages

## API Documentation

Once the backend is running, visit:
http://localhost:3001/api-docs

This provides interactive API documentation where you can test all endpoints.

## Next Steps

After everything is running:

1. Explore the UI - browse books, search, filter
2. Try the API - visit http://localhost:3001/api-docs
3. Add a new book through the UI
4. Edit an existing book
5. Delete a book
6. Start writing your automated tests!

## Stopping the Application

Press `Ctrl+C` in each terminal window to stop the servers.
