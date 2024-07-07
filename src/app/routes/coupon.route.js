const express = require("express");
const { deleteCoupon, getallCoupon, getaCoupon, createCoupon, updateCoupon, getallCouponCustomer} = require("../controllers/coupon.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); 
const router = express.Router();

// create
router.post("/create",authMiddleware, isAdmin, createCoupon);

router.get("/all-customer", getallCouponCustomer);

router.get("/all",authMiddleware, isAdmin, getallCoupon);

router.get("/:code", getaCoupon);

router.delete("/:_id",authMiddleware, isAdmin, deleteCoupon);

router.put("/:_id",authMiddleware, isAdmin, updateCoupon)

module.exports = router;