const Review = require("../models/review.model");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../../utils/validateMongodbId");

const jwt = require("jsonwebtoken");

// register createCate 
const createReview = asyncHandler(async (req, res) => {
    try {
        const orderDetail = await Order.findOne({ _id: _id }, {
            createdAt: 0,
            updatedAt: 0,
            __v: 0
        })
        .populate({path: "products.product", select:'name description images specs priceSale'})  
        .populate({path: "orderby", select:'firstname lastname'});
        return orderDetail
    } catch (error) {
        throw new Error(error);
    }
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