const express = require("express");
const { createUser, updatedUserAdmin, getaUserAdmin, loginUser, getallUser,getaUser,updatedUser, deleteaUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, addToWishlist, getWishlist, loginAdmin } = require("../controllers/user.controller");
const { authMiddleware, isAdmin, isAdminStaff } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// register
router.post("/register", createUser);
// login
router.post("/loginUser", loginUser);

router.post("/loginAdmin", loginAdmin);

// get all user
router.get("/all-users",authMiddleware, isAdminStaff, getallUser);
// get info user
router.get("/info-user",authMiddleware, getaUser);

// get info admin
router.get("/admin/:_id",authMiddleware, isAdmin , getaUserAdmin);
// update user
router.put("/update-user",authMiddleware, updatedUser);
// update user admin 
router.put("/admin/update/:_id",authMiddleware,isAdmin, updatedUserAdmin);
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