const Category = require("../models/category.model");
const Room = require("../models/room.model");
const Product = require("../models/product.model");
const slugify = require("slugify");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../../utils/validateMongodbId");

const jwt = require("jsonwebtoken");

// register createCate 
const createCate = asyncHandler(async (reqBody) => {
  try {
    let nameSlug = ""
    if (reqBody.nameCate) {
      nameSlug = slugify(reqBody.nameCate);
    }
    const newCategory = await Category.create(
      {
        nameCate: reqBody.nameCate,
        slug: nameSlug
      });
    if(reqBody.roomId)
    {
      let findRoom = await Room.findById(reqBody.roomId);
      findRoom.categories.push(newCategory._id);
      findRoom.save();
    }
    return newCategory;
  } catch (error) {
    throw new Error(error);
  }
});

const getaCategory = asyncHandler(async(id) => {
  try {
    const cate = await Category.findById(id, {
      _id: 1,
      nameCate: 1,
    });
    return cate; 
  } catch (error) {
    throw new Error(error);
  }
});

const getallCategory = asyncHandler(async() => {
  try {
    const data = await Category.find({},{
      _id: 1,
      nameCate: 1,
    });
    return data; 
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = asyncHandler(async(req) => {
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      req.params._id,
      {
        nameCate: req.body?.nameCate,
      },
      {
        new: true,
      }
    );
    if(req.body.roomId)
    {
      let findRoom = await Room.findById(req.body.roomId);
      findRoom.categories.push(updateCategory._id);
      findRoom.save();
    }
    if(req.body.nameCate)
    {
      updateCategory.slug = slugify(req.body.nameCate);
      await updateCategory.save()
    }
    return updateCategory;
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async(req) => {
  try {
    const deleteCategory = await Category.findByIdAndDelete(req.params._id);
    let findRoom = await Room.updateMany(
      {categories: req.params._id},
      { $pull: { categories: req.params._id } },
      { new: true }
    );

    let findProduct = await Product.updateMany(
      {category: req.params._id},
      { $pull: { category: req.params._id } },
      { new: true }
    );

    return deleteCategory;
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCate, getaCategory, getallCategory, updateCategory, deleteCategory };