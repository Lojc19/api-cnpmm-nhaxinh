const express = require("express");
const { createUser, loginUser, getallUser,getaUser,updatedUser, deleteaUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, addToWishlist, getWishlist } = require("../controllers/user.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// register
router.post("/register", createUser);
// login
router.post("/loginUser", loginUser);
// get all user
router.get("/all-users",authMiddleware, isAdmin, getallUser);
// get info user
router.get("/info-user",authMiddleware, getaUser);
// update user
router.put("/update-user",authMiddleware, updatedUser);
// delete user
router.delete("/delete-user/:id",authMiddleware, isAdmin, deleteaUser);

router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.put("/updatepass", authMiddleware, updatePassword);

router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

router.get("/wishlist", authMiddleware, getWishlist);
router.post("/wishlist", authMiddleware, addToWishlist);

module.exports = router;