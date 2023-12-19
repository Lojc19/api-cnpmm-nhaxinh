const express = require("express");
const { createOrder, getOrderByUserId, getOrderDetail, getAllOrders, updateOrderStatusUser, updateOrderStatusAdmin  } = require("../controllers/order.controller");
const { authMiddleware, isAdmin, isAdminStaff } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// create
router.post("/",authMiddleware, createOrder);

router.get("/myOrder",authMiddleware, getOrderByUserId);

router.get("/detail/:_id",authMiddleware, getOrderDetail);

router.get("/getAll",authMiddleware, isAdminStaff, getAllOrders);

router.put("/user/:_id",authMiddleware, updateOrderStatusUser);

router.put("/admin/:_id",authMiddleware, isAdminStaff, updateOrderStatusAdmin);

module.exports = router;