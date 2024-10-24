const express = require("express");
const router = express.Router();
const comments = require("../data/comments.js")
const error = require("../utilities/error.js")

// Retrieve all comments
router.get('/', (req, res) => {
  const {userId, postId} = req.query;
  let filteredComments = comments;
  if(userId) {
    filteredComments = filteredComments.filter(comment => comment.userId === userId);
  }
  if(postId) {
    filteredComments = filteredComments.filter(comment => comment.postId === postId);
  }
  res.json(filteredComments);
});