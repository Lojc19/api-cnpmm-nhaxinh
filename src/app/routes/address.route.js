const express = require("express");
const { createAddress, getAddress, updateAddress, deleteAddress  } = require("../controllers/address.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

router.post("/",authMiddleware, createAddress);

router.get("/", authMiddleware, getAddress);

router.put("/:_id", authMiddleware, updateAddress);

router.delete("/:_id", authMiddleware, deleteAddress);

module.exports = router;