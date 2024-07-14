const Order = require("../models/order.model");
const asyncHandler = require('express-async-handler');
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Coupon = require("../models/coupon.model");
const Product = require("../models/product.model");
const mongoose = require('mongoose');
const moment = require('moment');
const { sendEmailCreateOrder } = require("../controllers/email.controller");

const createOrder = asyncHandler(async (req) => {
    const { couponApplied } = req.body;
    const { _id } = req.user;
    try {
      const user = await User.findById(_id);
      let userCart = await Cart.findOne({ userId: user._id }).populate({path: "products.product", select:'name quantity'});
      let finalTotal = 0;
      let coupon = "";
      if (couponApplied) {
        coupon = await Coupon.findOne({code: couponApplied});
        const now = new Date();
        if(now.getTime() >= coupon.expiry.getTime() || coupon.quantity == 0)
        {
          throw new Error("Mã giảm giá đã hết hạn hoặc đã hết");
        }
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

      let date = new Date();
      let orderId = moment(date).format('DDHHmmss');

      let newOrder = await new Order({
        orderId: orderId,
        PaymentMethod: req.body.PaymentMethod,
        PaymentStatus: "Unpaid",
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
        orderStatus: "Pending",
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
      let data =
        {
          orderId: orderId
        }
      if((req.body.PaymentMethod).toLowerCas32e() === "vnpay")
      {
        return data
      }
      const dataMail = {
        to: req.body.email,
        text: "Cảm ơn bạn đã đặt hàng",
        subject: "Đặt hàng",
        link:  `Cảm ơn bạn đã đặt hàng: <br> Mã đơn hàng của bạn là: ${orderId} <br> Hãy truy cập vào trang https://ecom-noithat.vercel.app/dashboard/orders để theo dõi đơn hàng`,
      };
      sendEmailCreateOrder(dataMail)
      return data
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

const getOrderDetail = asyncHandler(async (orderId) => {
    try {
    const orderDetail = await Order.findOne({ orderId: orderId }, {
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
      if(status != "Processing" && status != "Pending" && status != "Cancelled" && status != "Delivered") throw new Error("Trạng thái không hợp lệ")
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

      let update = order.products.map((item) => {
        return {
          updateOne: {
            filter: { _id: item.product._id },
            update: { $inc: { quantity: +item.quantity, sold: -item.quantity } },
          },
        };
      });
      const updated = await Product.bulkWrite(update, {});

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

      const order = await Order.findByIdAndUpdate(
        _id,
        {
          status: status,
        },
        { new: true }
      );
      if(status == "Cancelled")
      {
        let update = order.products.map((item) => {
          return {
            updateOne: {
              filter: { _id: item.product._id },
              update: { $inc: { quantity: +item.quantity, sold: -item.quantity } },
            },
          };
        });
        const updated = await Product.bulkWrite(update, {});
      }
      if(status == "Delivered")
      {

        await Order.findByIdAndUpdate(
          _id,
          {
            PaymentStatus: "Paid",
          },
          { new: true }
        );
      }
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