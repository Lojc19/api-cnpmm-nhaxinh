const express = require("express");
const router = express.Router();
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductCategory,
  getProductRoom,
  searchProduct,
  getAllProductAdmin,
  updateImageProduct,
  updateImageProductDelete,
  getProductBestSell
} = require("../controllers/product.controller");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {uploadCloud} = require("../../config/cloudinary");

router.post("/create-product", authMiddleware, isAdmin, uploadCloud.array('images', 5), createProduct);
router.get("/bestsellers", getProductBestSell);

router.get("/:slug", getaProduct);
router.get("/category/:slug", getProductCategory);
router.get("/room/:id", getProductRoom);

router.put("/updateProduct/:_id", authMiddleware, isAdmin, updateProduct);
router.post("/updateImageProduct/:_id", authMiddleware, isAdmin, uploadCloud.array('images', 5), updateImageProduct);
router.delete("/updateImageDelete/", authMiddleware, isAdmin, updateImageProductDelete);

router.delete("/:_id", authMiddleware, isAdmin, deleteProduct);

router.get("/", getAllProduct);

router.get("/admin/getAll",authMiddleware, isAdmin, getAllProductAdmin);

router.get("/search/:s", searchProduct);

module.exports = router;