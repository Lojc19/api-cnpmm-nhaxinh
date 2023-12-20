const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const checkRv =  asyncHandler(async (req,res,next) => {
    const { username } = req.user;
    const adminUser = await User.findOne({username});
    if(adminUser.role !== "admin") {
        throw new Error("You are not admin");
    } else {
        next();
    }
});

module.exports = { authMiddleware, isAdmin };