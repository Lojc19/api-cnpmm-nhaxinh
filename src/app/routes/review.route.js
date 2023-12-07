const express = require("express");
const { createReview } = require("../controllers/review.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// create
router.post("/",authMiddleware, createReview);

module.exports = router;