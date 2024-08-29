const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    "username": "Sandesh Nepali",
    "password": "sandesh123"
  }
];

const isValid = (username) => {
  // Check if the username is not empty and is not already taken
  if (!username) return false;
  return !users.find(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Check if the username and password match a registered user
  const user = users.find(user => user.username === username && user.password === password);
  return !!user;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username }, 'sandeshnepali');
    return res.status(200).json({ message: "Login successful", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username; // Assuming `req.user` contains the authenticated user info

  const book = books.find(book => book.isbn === isbn);

  if (book) {
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username; // Extract the username from the token
  const book = books[isbn];

  if (!book) {
      return res.status(404).json({ message: "Book not found" });
  }

  if (book.reviews) {
      // Delete the review from the book
      delete book.reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
  } else {
      return res.status(404).json({ message: "Review not found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
