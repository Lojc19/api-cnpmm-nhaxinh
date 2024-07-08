const express = require("express");
const { overviewOrder, orderDate } = require("../controllers/statistical.controller");
const { authMiddleware, isAdmin, isAdminStaff } = require("../middlewares/authMiddleware"); 
const router = express.Router();


router.get("/overviewOrder",authMiddleware, isAdminStaff, overviewOrder);

router.get("/orderDate",authMiddleware, isAdminStaff, orderDate);

module.exports = router;