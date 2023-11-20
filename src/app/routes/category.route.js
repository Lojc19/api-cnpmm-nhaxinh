const express = require("express");
const { createCate, getaCategory, getallCategory} = require("../controllers/category.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// create
router.post("/create-cate",authMiddleware, isAdmin, createCate);

router.get("/getaCategory/:id", getaCategory);

router.get("/getallCategory", getallCategory);

module.exports = router;