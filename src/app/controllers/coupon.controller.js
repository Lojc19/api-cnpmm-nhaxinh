const Coupon = require("../models/coupon.model");
const asyncHandler = require('express-async-handler');
const couponService = require("../services/coupon.service")

// register User 
const createCoupon = asyncHandler(async (req, res) => {
  const data = await couponService.createCoupon(req)
  res.json({
    status:"success",
    data,
    message: "Tạo thành công"
  })
});

const getaCoupon = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const data = await couponService.getaCoupon(code);
  res.json({
    status: "success",
    data
  })
});

const getallCoupon = asyncHandler(async (req, res) => {
  const data = await couponService.getallCoupon();
  res.json({
    status: "success",
    data
  })
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const data = await couponService.deleteCoupon(_id);
  res.json({
    status: "success",
    data,
    message: "Xóa thành công",
  })
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const data = await couponService.updateCoupon(_id, req);
  res.json({
    status: "success",
    data,
    mesage: "Chỉnh sửa thành công"
  })
});

module.exports = {updateCoupon, deleteCoupon, getallCoupon, getaCoupon, createCoupon};