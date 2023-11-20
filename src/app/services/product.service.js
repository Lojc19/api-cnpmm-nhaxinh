const Product = require("../models/product.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");

const createProduct = asyncHandler(async (product) => {
  try {
    const productNew = await Product.create(product);
    return productNew;
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (_id, dataUpdate) => {
  try {
    const updateProduct = await Product.findOneAndUpdate({_id: _id}, dataUpdate, {
      new: true,
    });
    return updateProduct
  } catch (error) {
    throw new Error(error);
  }
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

const getaProduct = asyncHandler(async (id) => {
  try {
    const findProduct = await Product.findById(id,{
      ratings: 0,
      sold: 0,
      ratings: 0,
      createdAt: 0,
      updatedAt: 0,
      realease_date: 0,
      __v: 0,
    }).populate("category", "nameCate icUrl").populate("room", "nameRoom icUrl");
    return findProduct;
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async () => {
  try {
    const getAll = Product.find({},{
      ratings: 0,
      sold: 0,
      ratings: 0,
      createdAt: 0,
      updatedAt: 0,
      realease_date: 0,
      __v: 0,
    }).populate("category", "nameCate icUrl").populate("room", "nameRoom icUrl");
    return getAll;
  } catch (error) {
    throw new Error(error);
  }
});

const getProductCategory = asyncHandler(async (id) => {
  try {
    const products = await Product.find({category: id}, {
      ratings: 0,
      sold: 0,
      ratings: 0,
      createdAt: 0,
      updatedAt: 0,
      realease_date: 0,
      __v: 0,
    }).populate("category", "nameCate icUrl").populate("room", "nameRoom icUrl");
    return products;
  } catch (error) {
    throw new Error(error);
  }
});

const getProductRoom = asyncHandler(async (id) => {
  try {
    const product = await Product.find({room: id},{
        ratings: 0,
        sold: 0,
        ratings: 0,
        createdAt: 0,
        updatedAt: 0,
        realease_date: 0,
        __v: 0,
      }).populate("category", "nameCate icUrl").populate("room", "nameRoom icUrl");
    return product;
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
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
  addToWishlist,
  rating,
  getProductCategory,
  getProductRoom,
};