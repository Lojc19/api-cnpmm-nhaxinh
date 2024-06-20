const express = require("express");
const { createOrder, getOrderByUserId, getOrderDetail, getAllOrders, updateOrderStatusUser, updateOrderStatusAdmin  } = require("../controllers/order.controller");
const { authMiddleware, isAdmin, isAdminStaff } = require("../middlewares/authMiddleware"); 
const router = express.Router();
let $ = require('jquery');
const Order = require("../models/order.model");
const Product = require("../models/product.model");

const request = require('request');
const moment = require('moment');
// create
router.post("/",authMiddleware, createOrder);

router.get("/myOrder",authMiddleware, getOrderByUserId);

router.get("/detail/:_id",authMiddleware, getOrderDetail);

router.get("/getAll",authMiddleware, isAdminStaff, getAllOrders);

router.put("/user/:_id",authMiddleware, updateOrderStatusUser);

router.put("/admin/:_id",authMiddleware, isAdminStaff, updateOrderStatusAdmin);

router.post('/create_payment_url', function (req, res, next) {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    //let config = require('config');
    let tmnCode = "KZRPMPVP";
    let secretKey = "X5L9RD20DC7CZ7D7CVL4LO5NJA99Z1ID"
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
    let returnUrl = "http://localhost:3000/api/order/vnpay_return"
    let orderId = req.body.orderId;
    let amount = req.body.amount;
    let bankCode = "VNBANK";
    
    let locale = "vn";
    if(locale === null || locale === ''){
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    res.redirect(vnpUrl)
    // res.json({
    //     status: "success",
    //     url: vnpUrl,
    //     message: "Tao Url Thanh Cong"
    // })
});

router.get('/vnpay_return', function (req, res, next) {
    var vnp_Params = req.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    var tmnCode =  "KZRPMPVP";
    var secretKey = "X5L9RD20DC7CZ7D7CVL4LO5NJA99Z1ID";

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        const orderId = req.query.vnp_TxnRef;
        const code = vnp_Params['vnp_ResponseCode']
        if(code == "00")
        {
            updateOrderSuccess(orderId);
            res.redirect("https://www.facebook.com/BasLocc/")
            res.json({
                status: "success",
                message: "Thanh toán thành công"
            })
        }
        else
        {
            updateOrderFail(orderId);
            res.json({
                status: "fail",
                message: "Thanh toán thất bại"
            })
        }
        // res.render('success', {code: vnp_Params['vnp_ResponseCode']})
    } else{
        res.render('success', {code: '97'})
    }
});

const updateOrderSuccess = async(orderId) => {
    await Order.findOneAndUpdate(
        {orderId: orderId},  
        { PaymentStatus: "Paid" } , 
        {
        new: true
      })
    return
}

const updateOrderFail = async(orderId) => {
    await Order.findOneAndUpdate(
        {orderId: orderId},  
        { status: "Cancelled" } , 
        {
        new: true
      })

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
}

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
module.exports = router;