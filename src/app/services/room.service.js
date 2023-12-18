const Room = require("../models/room.model");
const Category = require("../models/category.model");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../../utils/validateMongodbId");

const jwt = require("jsonwebtoken");

// register 
const createRoom = asyncHandler(async (reqBody) => {
  try {
    const newRoom = await Room.create(reqBody);
    return newRoom;
  } catch (error) {
    throw new Error(error);
  }
});

const getaRoom = asyncHandler(async(id) => {
  const room = await Room.findById(id,{
    nameRoom: 1,
    _id: 0,
  }).populate("categories", "nameCate icUr");
  return room; 
});

const getallRoom = asyncHandler(async() => {
  try {
    const data = await Room.find({},{
      _id: 1,
      nameRoom: 1,
      icUrl: 1,
      bgImage: 1,
    });
    return data; 
  } catch (error) {
    throw new Error(error);
  }
});

const updateRoom = asyncHandler(async(req) => {
  try {
    const updateRoom = await Room.findByIdAndUpdate(
      req.params._id,
      {
        nameRoom: req.body?.nameRoom,
        icUrl: req.body?.icUrl,
      },
      {
        new: true,
      }
    );
    return updateRoom;
  } catch (error) {
    throw new Error(error);
  }
});

const deleteRoom = asyncHandler(async(req) => {
  try {
    const deleteRoom = await Room.findByIdAndDelete(req.params._id);
    return deleteRoom;
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createRoom, getaRoom, getallRoom, updateRoom, deleteRoom };