const User = require("../models/user.model");
const Product = require("../models/product.model");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../../utils/validateMongodbId");
const { generateToken } = require("../../config/jwtToken");
const { generateRefreshToken } = require("../../config/refreshtoken");
const crypto = require("crypto");
const {sendEmail} = require("../controllers/email.controller");
const jwt = require("jsonwebtoken");

// register User 
const createUser = asyncHandler(async (reqBody) => {
  const findUser = await User.findOne({ username: reqBody.username });
  const findPhoneUser = await User.findOne({ phoneNumber: reqBody.phoneNumber });
  const findMailUser = await User.findOne({ email: reqBody.email });
  if(findPhoneUser) {
    throw new Error("Phone number already exists");
  }
  if (findMailUser) {
    throw new Error("Email already Exists");
  }
  if (!findUser) {
    const newUser = await User.create(reqBody);
    const data = {
      _id: newUser?._id,
      firstname: newUser?.firstname,
      lastname: newUser?.lastname,
      email: newUser?.email,
      username: newUser?.username,
      phoneNumber: newUser?.phone,
    };
    return data;
  } else {
    throw new Error("Username already exists");
  }
});

// login with username password
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ username });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
      sameSite: 'None',
      secure: true,
    });
    const data = {
      token: generateToken(findUser?._id),
      role: findUser.role,
    }
    return data
  } else {
    throw new Error("Thông tin đăng nhập chưa đúng");
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ username });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
      sameSite: 'None', 
      secure: true,
    });
    const data = {
      token: generateToken(findAdmin?._id),
    }
    return data
  } else {
    throw new Error("Invalid Credentials");
  }
});

// log out
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate({refreshToken: refreshToken}, {
    refreshToken: "",
  },
  {
    new: true,
  }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

const updatePassword = asyncHandler(async (req) => {
  try {
    // const { _id } = req.user;
    const { passwordNow, passwordNew } = req.body;
    if(!(await req.user.isPasswordMatched(passwordNow))) {
      throw new Error("Mật khẩu cũ không đúng")
    }
    if(await req.user.isPasswordMatched(passwordNew)) {
      throw new Error("Mật khẩu mới trùng với mật khẩu cũ ")
    }
    // validateMongoDbId(_id);
    // const user = await User.findById(_id);
    if (passwordNew) {
      req.user.password = passwordNew;
      const updatedPassword = await req.user.save();
      return updatedPassword
    }
  }
  catch (err) {
    throw new Error(err)
  }
});

const forgotPasswordOTP = asyncHandler(async (req) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("Không tìm thấy người dùng");
  try {
    // const token = await user.createPasswordResetToken();
    const otpCode = await user.createOTPResetPassword();
    await user.save();
    // const resetURL = `Hello, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/api/user/reset-password/${token}'>Click Here</>`;

    const data = {
      to: email,
      text: "Forgot Password",
      subject: "Forgot Password OTP",
      link: otpCode.toString(),
    };
    sendEmail(data);
    return
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const {email, password } = req.body;
  const otpCode = req.body.otpCode;
  const user = await User.findOne({
    email: email,
    otpResetPassword: otpCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Có lỗi xảy ra, thời gian thao tác quá lâu hãy thực hiện lại");
  user.password = password;
  user.otpResetPassword = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return user;
});

const checkOtpResetPass = asyncHandler(async (req, res) => {
  try {
    const {otpCode, email} = req.body;
    const user = await User.findOne({
      email: email,
      otpResetPassword: otpCode,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Mã OTP hết hạn, hoặc sai vui lòng nhập lại");
    return
  } catch (error) {
    throw new Error(error);
  }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");

  const decoded =  jwt.verify(refreshToken, process.env.JWT_SECRET)
  if (user.id !== decoded._id) {
    throw new Error("There is something wrong with refresh token");
  }
  const accessToken = generateToken(user?._id);
  return accessToken
});

// get all user
const getallUser = asyncHandler(async (req) => {
  try {
    let data = [];
    if(req.user.role == "admin")
    {
      data = await User.find({ role: { $in: ["customer", "staff"] } });
    }
    if(req.user.role == "staff")
    {
      data = await User.find({ role: "customer" });
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
});

// get info 1 user 
const getaUser = asyncHandler(async (_id) => {
  validateMongoDbId(_id);
  try {
    const findUser = await User.findById(_id,{
      _id: 1,
      firstname: 1,
      lastname: 1,
      email: 1,
      username: 1,
      phoneNumber: 1,
    });
    return findUser
  } catch (error) {
    throw new Error(error);
  }
});


// get info 1 user 
const getaUserAdmin = asyncHandler(async (_id) => {
  validateMongoDbId(_id);
  try {
    const findUser = await User.findById(_id,{
      _id: 1,
      firstname: 1,
      lastname: 1,
      email: 1,
      username: 1,
      phoneNumber: 1,
      role: 1,
    });
    return findUser
  } catch (error) {
    throw new Error(error);
  }
});

// update user
const updatedUser = asyncHandler(async (_id,reqBody) => {
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: reqBody?.firstname,
        lastname: reqBody?.lastname,
        email: reqBody?.email,
        phone: reqBody?.phone,
      },
      {
        new: true,
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error);
  }
});

// update user admin
const updatedUserAdmin = asyncHandler(async (req) => {
  try {
    if(req.body.role != "staff" && req.body.role != "customer")
    {
      throw new Error("Role không khả dụng")
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params._id,
      {
        role: req.body?.role
      },
      {
        new: true,
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error);
  }
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

const getWishlist = asyncHandler(async (req) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate({path: "wishlist", select:'_id code name slug description shortDescription images price sale priceSale quantity totalrating'});
    const data = findUser.wishlist;
    return data;
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = asyncHandler(async (req) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const product = await Product.findById(prodId, {
      sold: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
      enable: 0,
    });
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
      return "Bỏ yêu thích thành công"
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
      return "Yêu thích thành công"
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {createUser, loginUser, getallUser, getaUser, updatedUser, deleteaUser, handleRefreshToken, logout, updatePassword,checkOtpResetPass, forgotPasswordOTP, resetPassword, addToWishlist, getWishlist, loginAdmin, getaUserAdmin, updatedUserAdmin};