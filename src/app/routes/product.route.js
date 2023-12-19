const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductCategory,
  getProductRoom,
  searchProduct,
  getAllProductAdmin
} = require("../controllers/product.controller");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create-product", authMiddleware, isAdmin, createProduct);

router.get("/product-detail/:_id", getaProduct);
router.get("/category/:id", getProductCategory);
router.get("/room/:id", getProductRoom);

router.put("/updateProduct/:_id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

router.get("/getAllProduct", getAllProduct);

router.get("/admin/getAll",authMiddleware, isAdmin, getAllProductAdmin);

router.get("/search/:s", searchProduct);

router.post("/updateImage/:_id", searchProduct);

module.exports = router;