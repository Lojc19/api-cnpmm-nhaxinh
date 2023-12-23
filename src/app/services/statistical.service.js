const Room = require("../models/room.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const asyncHandler = require('express-async-handler');

const overviewStatistical = asyncHandler(async (req) => {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);    

        let productCount = await Product.countDocuments();
        let order = await Order.find({
            orderTime: { $gte: startOfMonth, $lte: endOfMonth },
            status: "Delivered"
        })
        let orderPriceSumMonth = order.reduce((acc, doc) => acc + doc.total, 0);

        let orderCount = await Order.countDocuments();
        let userCount = await User.countDocuments();

        let data = {
            productCount: productCount,
            order: {
                orderCount,
                orderPriceSumMonth
            },
            userCount: userCount,
        }
        return data
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = { overviewStatistical }