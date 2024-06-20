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
    res.json({
        status: "success",
        vnpUrl: vnpUrl,
        message: "Tao Url Thanh Cong"
    })
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

router.get('/vnpay_ipn', function (req, res, next) {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let config = require('config');
    let secretKey = config.get('vnp_HashSecret');
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
    
    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó
    
    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if(secureHash === signed){ //kiểm tra checksum
        if(checkOrderId){
            if(checkAmount){
                if(paymentStatus=="0"){ //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                    if(rspCode=="00"){
                        //thanh cong
                        //paymentStatus = '1'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                        res.status(200).json({RspCode: '00', Message: 'Success'})
                    }
                    else {
                        //that bai
                        //paymentStatus = '2'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                        res.status(200).json({RspCode: '00', Message: 'Success'})
                    }
                }
                else{
                    res.status(200).json({RspCode: '02', Message: 'This order has been updated to the payment status'})
                }
            }
            else{
                res.status(200).json({RspCode: '04', Message: 'Amount invalid'})
            }
        }       
        else {
            res.status(200).json({RspCode: '01', Message: 'Order not found'})
        }
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
    }
});

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