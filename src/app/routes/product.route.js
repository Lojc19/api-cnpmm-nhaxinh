const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  getProductCategory,
  getProductRoom,
} = require("../controllers/product.controller");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create-product", authMiddleware, isAdmin, createProduct);

router.get("/getaProduct/:id", getaProduct);
router.get("/category/:id", getProductCategory);
router.get("/room/:id", getProductRoom);

router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/updateProduct/:_id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

router.get("/getAllProduct", getAllProduct);

module.exports = router;