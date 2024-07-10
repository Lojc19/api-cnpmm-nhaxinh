const Order = require("../models/order.model");
const asyncHandler = require('express-async-handler');
const orderService = require("../services/order.service")

const createOrder = asyncHandler(async (req, res) => {
    const data = await orderService.createOrder(req)
    res.json({
      status:"success",
      data,
      message: "Đặt hàng thành công"
    })
});
  
  const getOrderDetail = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const data = await orderService.getOrderDetail(orderId);
    res.json({
      status:"success",
      data,
      message: ""
    })
  });

const getAllOrders = asyncHandler(async (req, res) => {
    const data = await orderService.getAllOrders()
    res.json({
    status: "success",
    data,
    message: ""
  })
});
  
const getOrderByUserId = asyncHandler(async (req, res) => {
  const data = await orderService.getOrderByUserId(req)
  res.json({
    status:"success",
    data,
    message: ""
  })
});

const updateOrderStatusUser = asyncHandler(async (req, res) => {
  const data = await orderService.updateOrderStatusUser(req)
  res.json({
    status:"success",
    data,
    message: "Cập nhật thành công"
  })
});

const updateOrderStatusAdmin = asyncHandler(async (req, res) => {
  const data = await orderService.updateOrderStatusAdmin(req)
  res.json({
    status:"success",
    data,
    message: "Cập nhật thành công"
  })
});

module.exports = {
  createOrder,
  getOrderByUserId,
  getOrderDetail,
  getAllOrders,
  updateOrderStatusUser,
  updateOrderStatusAdmin
};