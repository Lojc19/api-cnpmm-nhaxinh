const Product = require("../models/product.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const productService = require("../services/product.service")

const validateMongoDbId = require("../../utils/validateMongodbId");

const createProduct = asyncHandler(async (req, res) => {
  const data = await productService.createProduct(req);
  res.json({
    status: "success",
    data,
    message: "Thêm sản phẩm thành công"
  })
});

const updateProduct = asyncHandler(async (req, res) => {
  const data = await productService.updateProduct(req);
  res.json({
    status: "success",
    data,
    message: "Cập nhật thành công"
  })
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params;
  validateMongoDbId(id);
  try {
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getaProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const data = await productService.getaProduct(_id);
  res.json({
    status: "success",
    data,
    message: "",
  })
});

const getAllProduct = asyncHandler(async (req, res) => {
  const data = await productService.getAllProduct(req);
  res.json({
    status: "success",
    data,
    message: "",
  })
});

const getAllProductAdmin = asyncHandler(async (req, res) => {
  const data = await productService.getAllProductAdmin(req);
  res.json({
    status: "success",
    data,
    message: "",
  })
});

const searchProduct = asyncHandler(async (req, res) => {
  const data = await productService.searchProduct(req);
  res.json({
    status: "success",
    data,
    message: "",
  })
});

const getProductCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const data = await productService.getProductCategory(id);
  res.json({
    status:"success",
    data,
    message: "",
  });
});

const getProductRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const data = await productService.getProductRoom(id);
  res.json({
    status:"success",
    data,
    message: "",
  });
});

const uploadImageProduct = asyncHandler(async (req, res) => {
  const data = await productService.uploadImageProduct(req);
  res.json({
    status:"success",
    data,
    message: "",
  });
});

module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductCategory,
  getProductRoom,
  searchProduct,
  getAllProductAdmin,
  uploadImageProduct
};