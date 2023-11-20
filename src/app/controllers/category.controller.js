const Cate = require("../models/category.model");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../../utils/validateMongodbId");
const cateService = require("../services/category.service")
const jwt = require("jsonwebtoken");

// register cate 
const createCate = asyncHandler(async (req, res) => {
    const data = await cateService.createCate(req.body)
    res.json({
      status:"success",
      data
    })
});

const getaCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await cateService.getaCategory(id);
  res.json({
    status: "success",
    data
  })
});

const getallCategory = asyncHandler(async (req, res) => {
  const data = await cateService.getallCategory();
  res.json({
    status: "success",
    data
  })
});


module.exports = {createCate, getaCategory, getallCategory};