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
  }).populate("categories", "nameCate icUrl");
  return room; 
});

const getallRoom = asyncHandler(async() => {
  try {
    const data = await Room.find({},{
      _id: 1,
      nameRoom: 1,
      icUrl: 1,
    });
    return data; 
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createRoom, getaRoom, getallRoom };