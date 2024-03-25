const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message: "Please provide username and password"});
  }
  if(isValid(username)) {
    users.push({username, password});
    return res.status(200).json({message: "Registration successful"});
  } else {
    return res.status(208).json({message: "Username already exists"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  return new Promise((resolve, reject) => {
    if (books) {

      resolve(res.json(JSON.stringify(books)));
    } else {
      reject(res.status(404).json({message: "Books not found"}));
    }

  })

});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (isbn) {
      if (books[isbn]) {
        resolve(res.json(JSON.stringify(books[isbn])));
      } else {
        reject(res.status(404).json({message: "Book not found"}));
      }
    } else {
      reject(res.status(400).json({message: "Please provide ISBN"}));
    }
  })
});
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  return new Promise((resolve, reject) => {
    const author = req.params.author;
    if (author) {
      const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
      if (booksByAuthor.length === 0) {
        reject(res.status(404).json({message: "No books found"}));
      }
      resolve(res.json(JSON.stringify(booksByAuthor)));
    } else {
      reject(res.status(400).json({message: "Please provide an author name"}));
    }
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  return new Promise((resolve, reject) => {
    let title = req.params.title;
    let book = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

    if (!title) {
      reject(res.status(400).json({message: "Please provide a title"}));
    }

    if (book.length === 0) {
      reject(res.status(404).json({message: "No books found"}));
    }
    return resolve(res.json(JSON.stringify(book)));
  })

  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  return new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (isbn) {
      if (books[isbn]) {
        resolve(res.json(JSON.stringify(books[isbn].reviews)));
      } else {
        reject(res.status(404).json({message: "Book not found"}));
      }
    } else {
      reject(res.status(400).json({message: "Please provide ISBN"}));
    }
  })
});

module.exports.general = public_users;
