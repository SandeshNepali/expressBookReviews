const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// User Registration
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    if (users[username]) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Validate and add user
    if (username && password && isValid(username, password)) {
        users[username] = { password }; // Save user details
        return res.status(201).json({ message: "User registered successfully" });
    } else {
        return res.status(400).json({ message: "Invalid registration details" });
    }
});

// Get all books
public_users.get('/', (req, res) => {
    res.json(books);
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books.find(book => book.isbn === isbn);

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details by author
public_users.get('/author/:author', (req, res) => {
    const { author } = req.params;
    const booksByAuthor = books.filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    const { title } = req.params;
    const booksByTitle = books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

    if (booksByTitle.length > 0) {
        res.json(booksByTitle);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books.find(book => book.isbn === isbn);

    if (book) {
        res.json(book.reviews || []);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
