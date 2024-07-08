const Room = require("../models/room.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const asyncHandler = require('express-async-handler');

const overviewOrder = asyncHandler(async () => {
    try {
        const now = new Date();
        const currentYear = now.getFullYear();
        // Ngày bắt đầu của năm hiện tại và năm tiếp theo
        const startOfCurrentYear = new Date(currentYear, 0, 1); // 01-01 của năm hiện tại
        const startOfNextYear = new Date(currentYear + 1, 0, 1); // 01-01 của năm tiếp theo

        const orders = await Order.aggregate([
            {
                // Lọc các đơn hàng trong khoảng thời gian mong muốn (ví dụ: năm 2024)
                $match: {
                    orderTime: {
                        $gte: startOfCurrentYear,
                        $lt: startOfNextYear,
                    },
                },
            },
            {
                // Nhóm các đơn hàng theo năm và tháng
                $group: {
                    _id: {
                        year: { $year: '$orderTime' },
                        month: { $month: '$orderTime' },
                    },
                    totalAmount: { $sum: '$total' },
                    count: { $sum: 1 },
                },
            },
            {
                // Sắp xếp kết quả theo năm và tháng
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                },
            },
        ]);

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const formattedOrders = orders.map(order => ({
            year: order._id.year,
            month: monthNames[order._id.month - 1], // Chuyển số tháng thành tên tháng
            totalAmount: order.totalAmount,
            count: order.count
        }));

        return formattedOrders
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { overviewOrder }