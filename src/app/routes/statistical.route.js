const express = require("express");
const { overviewOrder } = require("../controllers/statistical.controller");
const { authMiddleware, isAdmin, isAdminStaff } = require("../middlewares/authMiddleware"); 
const router = express.Router();


router.get("/overviewOrder",authMiddleware, isAdminStaff, overviewOrder);

module.exports = router;