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
                    PaymentStatus: 'Paid',
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

const orderDate = asyncHandler(async (req) => {
    try {
        const { startDate, endDate } = req.query;
        // Chuyển đổi startDate và endDate sang đối tượng Date
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Thêm một ngày vào endDate
        end.setDate(end.getDate() + 1);
        const orders = await Order.aggregate([
            {
                // Lọc các đơn hàng trong khoảng thời gian từ startDate đến endDate
                $match: {
                    orderTime: {
                        $gte: start,
                        $lt: end,
                    },
                    PaymentStatus: 'Paid', // Thêm điều kiện PaymentStatus là 'paid' nếu cần
                },
            },
            {
                // Nhóm các đơn hàng theo ngày
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderTime' } },
                    totalAmount: { $sum: '$total' },
                    count: { $sum: 1 },
                },
            },
            {
                // Sắp xếp kết quả theo ngày
                $sort: {
                    '_id': 1,
                },
            },
        ]);
        return orders
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { overviewOrder, orderDate }