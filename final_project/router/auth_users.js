const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const user = users.filter(user => user.username === username);
  return user.length == 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.filter(user => user.username === username && user.password === password);
  return user.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Please provide username and password"});
  }
  if(authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data: password}, "access", {expiresIn
    : 60*60});

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({message: "Login successful"});
  } else {
    return res.status(208).json({message: "Invalid credentials"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.body.review;
  console.log(req.session.authorization)
  if (req.session.authorization.username) {
    
    if (review) {
      books[isbn].reviews[req.session.authorization.username] = review;
       return res.status(200).json({message: "Review added successfully"});
    } else {
      return res.status(400).json({message: "Please provide review"});
    }
  }
  return res.status(403).json({message: "Please login first"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const book = books[isbn];
  console.log(req.session.authorization)
  if (book && book.reviews[username]) {
    const review = book.reviews[username];
    delete book.reviews[username];
    return res.status(200).json({message: "Review deleted successfully", review});
  }
  return res.status(404).json({message: "Review not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
