const User = require("../models/user.model");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../../utils/validateMongodbId");
const { generateToken } = require("../../config/jwtToken");
const { generateRefreshToken } = require("../../config/refreshtoken");
const userService = require("../services/user.service")

// register User 
const createUser = asyncHandler(async (req, res) => {
    const data = await userService.createUser(req.body);
    res.json({
      status: "success",
      data,
      message: "Đăng kí thành công"
    });
});

// login with username password
const loginUser = asyncHandler(async (req,res) => {
    const data = await userService.loginUser(req, res);
    res.json({
      status: "success",
      data,
      message: "Đăng nhập thành công"
    })
});

const loginAdmin = asyncHandler(async (req,res) => {
  const data = await userService.loginAdmin(req, res);
  res.json({
    status: "success",
    data,
    message: "Đăng nhập thành công"
  })
});

const handleRefreshToken = asyncHandler(async (req,res) => {
  const accessToken = await userService.handleRefreshToken(req,res);
  res.json({
    status: "success",
    data: {
      accessToken: accessToken,
    },
    message: "AcessToken"
  })
});

const logout = asyncHandler(async (req,res) => {
  const data = await userService.logout(req,res);
});

const updatePassword = asyncHandler(async (req,res) => {
  const updatePassword = await userService.updatePassword(req);
  res.json({
    status: "success",
    data: null,
    message: "Đổi mật khẩu thành công"
  })
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  try {
    await userService.forgotPasswordToken(req,res);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const data = await userService.resetPassword(req, res);
    res.json({
      status: "success",
      data: null,
      message: "Đổi mật khẩu thành công"
    })  } catch (error) {
    throw new Error(error);
  }
});

// get all user
const getallUser = asyncHandler(async (req, res) => {
  const data = await userService.getallUser(req);
  res.json({
    status: "success",
    data,
    message: "",
  })
});

// get info 1 user 
const getaUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const data = await userService.getaUser(_id);
    res.json({
      status: "success",
      data,
      message: "",
    });
});

// get info 1 user admin
const getaUserAdmin = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const data = await userService.getaUserAdmin(_id);
  res.json({
    status: "success",
    data,
    message: "",
  });
});


// update user
const updatedUser = asyncHandler(async (req, res) => {
  const { _id }= req.user;
  const data = await userService.updatedUser(_id,req.body);
  res.json({
    status: "success",
    data,
    message: "Cập nhật thông tin thành công",
  });
});


const updatedUserAdmin = asyncHandler(async (req, res) => {
  const data = await userService.updatedUserAdmin(req);
  res.json({
    status: "success",
    data,
    message: "Cập nhật thông tin thành công",
  });
});

// delete user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  const message = await userService.addToWishlist(req);
  res.json({
    status: "success",
    message,
  });
});

const getWishlist = asyncHandler(async (req, res) => {
  const data = await userService.getWishlist(req);
  res.json({
    status: "success",
    data,
    message: "",
  });
});

module.exports = {createUser, loginUser, loginAdmin, getallUser, getaUser, updatedUser, deleteaUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, addToWishlist, getWishlist, getaUserAdmin, updatedUserAdmin};