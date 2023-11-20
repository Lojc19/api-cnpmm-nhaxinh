const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if(token) {
                const decode = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findOne({_id: decode?._id});
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error("Not authorized token expired, Please login again");
        }
    }
    else {
        throw new Error("There is no token attached to header");
    }
});

const isAdmin =  asyncHandler(async (req,res,next) => {
    const { username } = req.user;
    const adminUser = await User.findOne({username});
    if(adminUser.role !== "admin") {
        throw new Error("You are not admin");
    } else {
        next();
    }
});

module.exports = { authMiddleware, isAdmin };