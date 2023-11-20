const Category = require("../models/category.model");
const Room = require("../models/room.model");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../../utils/validateMongodbId");

const jwt = require("jsonwebtoken");

// register createCate 
const createCate = asyncHandler(async (reqBody) => {
  try {
    const newCategory = await Category.create(
      {
        nameCate: reqBody.nameCate,
        icUrl: reqBody.icUrl
      });
    const findRoom = await Room.findById(reqBody.roomId);
    findRoom.categories.push(newCategory._id);
    findRoom.save();
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
      icUrl: 1,
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
      icUrl: 1,
    });
    return data; 
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCate, getaCategory, getallCategory };