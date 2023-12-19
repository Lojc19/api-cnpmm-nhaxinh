const Order = require("../models/order.model");
const asyncHandler = require('express-async-handler');
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Coupon = require("../models/coupon.model");
const Product = require("../models/product.model");
const mongoose = require('mongoose');

const createOrder = asyncHandler(async (req) => {
    const { couponApplied } = req.body;
    const { _id } = req.user;
    try {
      const user = await User.findById(_id);
      let userCart = await Cart.findOne({ userId: user._id }).populate({path: "products.product", select:'name quantity'});
      console.log(userCart.products)
      let finalTotal = 0;
      let coupon = "";
      if (couponApplied) {
        coupon = await Coupon.findOne({code: couponApplied});
        finalTotal = userCart.cartTotal - userCart.cartTotal * coupon.discount / 100;
      } else {
        finalTotal = userCart.cartTotal;
      }

      for (let i = 0; i < userCart.products.length; i++) {
        if(userCart.products[i].product.quantity < userCart.products[i].quantity)
        {
          throw new Error("Sản phẩm " + `${userCart.products[i].product.name}` + " số lượng không khả dụng" ); 
        }
      }

      let newOrder = await new Order({
        PaymentMethod: req.body.PaymentMethod,
        name:  req.body.name,
        email:  req.body.email,
        phoneNumber:  req.body.phoneNumber,
        products: userCart.products,
        addressShipping: {
            province: req.body.addressShipping.province,
            district: req.body.addressShipping.district,
            ward: req.body.addressShipping.ward,
            note: req.body?.addressShipping.note,
        },
        total: finalTotal,
        coupon: coupon._id,
        orderby: user._id,
        orderStatus: "Processing",
      }).save();

      let update = userCart.products.map((item) => {
        return {
          updateOne: {
            filter: { _id: item.product._id },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
          },
        };
      });
      const updated = await Product.bulkWrite(update, {});
      await Cart.findOneAndDelete({ userId: _id });
      return 
    } catch (error) {
      throw new Error(error);
    }
  });
  
const getAllOrders = asyncHandler(async () => {
    try {
        const allOrders = await Order.find({},{
            createdAt: 0,
            updatedAt: 0,
            __v: 0
        }).sort({orderTime: -1})
        .populate({path: "products.product", select:'name description images specs priceSale'})  
        .populate({path: "orderby", select:'firstname lastname'})
        .populate({path: "coupon", select:'code discount'})
        .exec();
      return allOrders
    } catch (error) {
      throw new Error(error);
    }
});

const getOrderDetail = asyncHandler(async (_id) => {
    try {
    const orderDetail = await Order.findOne({ _id: _id }, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0
    })
    .populate({path: "products.product", select:'name description images specs priceSale'})  
    .populate({path: "coupon", select:'code discount'});
    return orderDetail
    } catch (error) {
      throw new Error(error);
    }
});

const getOrderByUserId = asyncHandler(async (req) => {
    try {
      const userorders = await Order.find({ orderby: req.user._id }, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0
      }).sort({orderTime: -1})
        .populate({path: "products.product", select:'name description images specs priceSale'})  
        .populate({path: "coupon", select:'code discount'})  
        .exec();
      return userorders
    } catch (error) {
      throw new Error(error);
    }
});
  
const updateOrderStatusUser = asyncHandler(async (req) => {
    try {

      const { status } = req.body;
      const { _id } = req.params;
      if(status != "Processing" && status != "Dispatched" && status != "Cancelled" && status != "Delivered") throw new Error("Trạng thái không hợp lệ")
      let order = await Order.findOne({_id: _id});
      if(status !== "Cancelled") throw new Error("Lỗi")
      if(order.status == "Cancelled" || order.status != "Processing") throw new Error("Không chỉnh sửa được trạng thái đơn hàng")

      await Order.findByIdAndUpdate(
        _id,
        {
          status: status,
        },
        { new: true }
      );
      
      return
    } catch (error) {
      throw new Error(error);
    }
});

const updateOrderStatusAdmin = asyncHandler(async (req) => {
    try {
      const { status } = req.body;
      const { _id } = req.params;
      if(status != "Processing" && status != "Dispatched" && status != "Cancelled" && status != "Delivered") throw new Error("Trạng thái không hợp lệ")

      await Order.findByIdAndUpdate(
        _id,
        {
          status: status,
        },
        { new: true }
      );
      return
    } catch (error) {
      throw new Error(error);
    }
});

module.exports = {
createOrder,
getOrderDetail,
getAllOrders, 
getOrderByUserId,
updateOrderStatusAdmin,
updateOrderStatusUser,
}