const express = require("express");
const { addtoCart, getCart, emptyCart, updateCart} = require("../controllers/cart.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// create
router.post("/addtoCart",authMiddleware, addtoCart);

router.get("/getCart", authMiddleware, getCart);

router.delete("/emptyCart", authMiddleware, emptyCart);

router.put("/updateCart", authMiddleware, updateCart);

module.exports = router;