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
    message: "Cập nhật thành công"
  })
});

const updateImageProduct = asyncHandler(async (req, res) => {
  const data = await productService.updateImageProduct(req);
  res.json({
    status: "success",
    message: "Cập nhật thành công"
  })
});

const updateImageProductDelete = asyncHandler(async (req, res) => {
  const data = await productService.updateImageProductDelete(req);
  res.json({
    status: "success",
    message: "Cập nhật thành công"
  })
});

const updateImageProductAdd = asyncHandler(async (req, res) => {
  const data = await productService.updateImageProductAdd(req);
  res.json({
    status: "success",
    message: "Cập nhật thành công"
  })
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const deleteProduct = await productService.deleteProduct(req);
    res.json({
      status: "success",
      message: "Xóa sản phẩm thành công"
    })
  } catch (error) {
    throw new Error(error);
  }
});

const getaProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const data = await productService.getaProduct(slug);
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

const getProductBestSell = asyncHandler(async (req, res) => {
  const data = await productService.getProductBestSell(req);
  res.json({
    status: "success",
    data,
    message: ""
  })
});

const getProductRecommend = asyncHandler(async (req, res) => {
  const data = await productService.getProductRecommend(req);
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
  const { slug } = req.params;
  const data = await productService.getProductCategory(slug);
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
  updateImageProduct,
  updateImageProductDelete,
  getProductBestSell,
  updateImageProductAdd,
  getProductRecommend
};