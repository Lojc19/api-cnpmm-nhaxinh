const express = require("express");
const { createReview,getReviewByProductID,getAllReview, getReviewDetail, updateReview, deleteReview } = require("../controllers/review.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// create
router.post("/",authMiddleware, createReview);

router.get("/byProduct/:_id", getReviewByProductID);

router.get("/all",authMiddleware, isAdmin, getAllReview);

router.get("/detail/:_id", getReviewDetail);

router.put("/:_id",authMiddleware, isAdmin, updateReview);

router.delete("/:_id",authMiddleware, isAdmin, deleteReview);

module.exports = router;