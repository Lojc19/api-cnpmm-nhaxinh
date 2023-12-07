const Review = require("../models/review.model");
const asyncHandler = require('express-async-handler');
const reviewService = require("../services/review.service")

const createReview = asyncHandler(async (req, res) => {
    const data = await reviewService.createReview(req)
    res.json({
      status:"success",
      data,
      message: ""
    })
});
  
  const getReviewDetail = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const data = await orderService.getOrderDetail(_id);
    res.json({
      status:"success",
      data,
      message: ""
    })
  });

const getAllReview = asyncHandler(async (req, res) => {
    const data = await orderService.getAllOrders()
    res.json({
    status: "success",
    data,
    message: ""
  })
});
  
const getReviewByProductID = asyncHandler(async (req, res) => {
  const data = await orderService.getOrderByUserId(req)
  res.json({
    status:"success",
    data,
    message: ""
  })
});

const updateReview = asyncHandler(async (req, res) => {
  const data = await orderService.updateOrderStatusUser(req)
  res.json({
    status:"success",
    data,
    message: "Cập nhật thành công"
  })
});

const deleteReview = asyncHandler(async (req, res) => {
  const data = await orderService.updateOrderStatusAdmin(req)
  res.json({
    status:"success",
    data,
    message: "Cập nhật thành công"
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