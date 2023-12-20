const Review = require("../models/review.model");
const asyncHandler = require('express-async-handler');
const reviewService = require("../services/review.service")

const createReview = asyncHandler(async (req, res) => {
    const data = await reviewService.createReview(req)
    res.json({
      status:"success",
      data,
      message: "Bạn đã đánh giá thành công, xin chờ kiểm duyệt"
    })
});
  
const getReviewDetail = asyncHandler(async (req, res) => {
  const data = await reviewService.getReviewDetail(req);
  res.json({
    status:"success",
    data,
    message: ""
  })
});

const getAllReview = asyncHandler(async (req, res) => {
    const data = await reviewService.getAllReview()
    res.json({
    status: "success",
    data,
    message: ""
  })
});
  
const getReviewByProductID = asyncHandler(async (req, res) => {
  const data = await reviewService.getReviewByProductID(req)
  res.json({
    status:"success",
    data,
    message: ""
  })
});

const updateReview = asyncHandler(async (req, res) => {
  const data = await reviewService.updateReview(req)
  res.json({
    status:"success",
    message: "Cập nhật thành công"
  })
});

const deleteReview = asyncHandler(async (req, res) => {
  const data = await reviewService.deleteReview(req)
  res.json({
    status:"success",
    message: "Xóa thành công"
  })
});

module.exports = {
    createReview,
    getReviewDetail,
    getAllReview,
    getReviewByProductID,
    updateReview,
    deleteReview
};