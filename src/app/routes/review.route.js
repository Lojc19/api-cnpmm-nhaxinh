const express = require("express");
const { createReview,getReviewByProductID,getAllReview } = require("../controllers/review.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// create
router.post("/",authMiddleware, createReview);

router.get("/byProduct/:_id", getReviewByProductID);

router.get("/all",authMiddleware, isAdmin, getAllReview);

module.exports = router;