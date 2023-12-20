const express = require("express");
const { createCate, getaCategory, getallCategory, updateCategory, deleteCategory} = require("../controllers/category.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// create
router.post("/create-cate",authMiddleware, isAdmin, createCate);

router.get("/getaCategory/:id", getaCategory);

router.get("/all", getallCategory);

router.put("/:_id",authMiddleware, isAdmin, updateCategory);

router.delete("/:_id",authMiddleware, isAdmin, deleteCategory);

module.exports = router;