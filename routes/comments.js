const express = require("express");
const router = express.Router();
const comments = require("../data/comments");
const error = require("../utilities/error"); // Import error

// Retrieve all comments
router.get('/', (req, res) => {
  const { userId, postId } = req.query;

  let filteredComments = comments;

  if (userId) {
    filteredComments = filteredComments.filter(comment => comment.userId == userId);
  }

  if (postId) {
    filteredComments = filteredComments.filter(comment => comment.postId == postId);
  }

  res.json(filteredComments);
});

// Create a new comment
router.post('/', (req, res, next) => {
  const { userId, postId, body } = req.body;
  
  if (userId && postId && body) {
    const newComment = {
      id: comments.length + 1, // Simple unique id generation
      userId,
      postId,
      body
    };

    comments.push(newComment);
    res.status(201).json(newComment); // Created status
  } else {
    res.status(400).json({ error: "Insufficient Data" });
  }
});

// Retrieve a comment by id
router.get('/:id', (req, res, next) => {
  const comment = comments.find(c => c.id == req.params.id);

  if (comment) {
    res.json(comment);
  } else {
    next(error(404, "Comment Not Found"));
  }
});

// Update a comment by id
router.patch('/:id', (req, res, next) => {
  const comment = comments.find(c => c.id == req.params.id);

  if (comment) {
    comment.body = req.body.body || comment.body; // Update the body if provided
    res.json(comment);
  } else {
    next(error(404, "Comment Not Found"));
  }
});

// Delete a comment by id
router.delete('/:id', (req, res, next) => {
  const index = comments.findIndex(c => c.id == req.params.id);

  if (index !== -1) {
    const deletedComment = comments.splice(index, 1);
    res.json(deletedComment);
  } else {
    next(error(404, "Comment Not Found"));
  }
});

// Retrieve comments made on a post by postId
router.get('/comments/post/:id', (req, res) => {
  const filteredComments = comments.filter(comment => comment.postId == req.params.id);
  res.json(filteredComments);
});

// Retrieve comments made by a user
router.get('/comments/user/:id', (req, res) => {
  const filteredComments = comments.filter(comment => comment.userId == req.params.id);
  res.json(filteredComments);
});

// Retrieve all comments made on a post by a user
router.get('/posts/:id/comments', (req, res) => {
  const { userId } = req.query;
  const filteredComments = comments.filter(comment => comment.postId == req.params.id && (!userId || comment.userId == userId));
  res.json(filteredComments);
});

// Retrieve comments made by a user on a post
router.get('/users/:id/comments', (req, res) => {
  const { postId } = req.query;
  const filteredComments = comments.filter(comment => comment.userId == req.params.id && (!postId || comment.postId == postId));
  res.json(filteredComments);
});

module.exports = router;
