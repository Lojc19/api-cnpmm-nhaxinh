const express = require("express");
const { overviewStatistical } = require("../controllers/statistical.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// create
router.get("/",authMiddleware, isAdmin, overviewStatistical);

module.exports = router;