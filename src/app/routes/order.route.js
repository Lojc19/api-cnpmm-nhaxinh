const express = require("express");
const { addtoCart, getCart } = require("../controllers/cart.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// create
router.post("/order",authMiddleware, addtoCart);


module.exports = router;