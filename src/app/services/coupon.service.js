const Coupon = require("../models/coupon.model");
const asyncHandler = require('express-async-handler');
var voucher_codes = require('voucher-code-generator');

// register User 
const createCoupon = asyncHandler(async (req) => {
  try{
    let codeCoupon = voucher_codes.generate({
      prefix: "homeLC-",
      postfix: "-2024",
      count: 1,
      length: 8,
    });
    const coupon = await Coupon.create(
    {
      name: req.body.name,
      code: codeCoupon[0],
      expiry: req.body.expiry,
      quantity: req.body.quantity,
      discount: req.body.discount
    });
    const data = {
      name: coupon.name,
      code: coupon.code,
      expiry: coupon.expiry,
      quantity: coupon.quantity,
      discount: coupon.discount
    }
    return data
  } catch (error) {
    throw new Error(error);
  }
});

const getaCoupon = asyncHandler(async (code) => {
  try {
    const coupon = await Coupon.findOne({code: code}, {
      name: 1,
      code: 1,
      discount: 1,
      expiry: 1,
      quantity: 1
    });
    if(!coupon)
    {
      throw new Error("Mã giảm giá không đúng");
    }
    const now = new Date();
    if(now.getTime() >= coupon.expiry.getTime())
    {
      throw new Error("Mã giảm giá đã hết hạn");
    }
    if(coupon.quantity === 0)
    {
      throw new Error("Mã giảm giá đã hết")
    }
    return coupon
  } catch (error) {
    throw new Error(error);
  }
});

const getallCoupon = asyncHandler(async () => {
  try {
    const data = await Coupon.find({},{
      createdAt: 1,
      updatedAt: 0,
      __v: 0
    });
    return data
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (_id) => {
  try {
    await Coupon.findOneAndDelete({_id: _id});
    return
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (_id, req) => {
  try {
    const updatecoupon = await Coupon.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    return
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {createCoupon, getaCoupon, getallCoupon, deleteCoupon, updateCoupon};