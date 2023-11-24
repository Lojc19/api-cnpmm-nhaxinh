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
  const { id } = req.params;
  validateMongoDbId(id);
  const data = await productService.getaProduct(id);
  res.json({
    status: "success",
    data,
    message: "",
  })
});

const getAllProduct = asyncHandler(async (req, res) => {
  const data = await productService.getAllProduct();
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

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  rating,
  getProductCategory,
  getProductRoom,
};