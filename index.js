const bodyParser = require("body-parser");
const express = require('express')
const db = require('./src/config/db/connect');
const app = express()
const dotenv = require("dotenv").config()
const port = process.env.PORT || 4000

const userRouter = require('./src/app/routes/user.route')
const productRouter = require('./src/app/routes/product.route');
const roomRouter = require('./src/app/routes/room.route');
const cateRouter = require('./src/app/routes/category.route');
const cartRouter = require('./src/app/routes/cart.route');
const addressRouter = require('./src/app/routes/address.route');
const couponRouter = require('./src/app/routes/coupon.route');
const orderRouter = require('./src/app/routes/order.route');

const cors = require('cors')
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { errorHandler, notFound } = require('./src/app/middlewares/errorHandler');

// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', `http://localhost:3000/`);

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });
//conect
app.use(cors(
  {
    origin : 'http://localhost:3000',
    credentials: true
  }
))

db.connect();

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/room", roomRouter);
app.use("/api/category", cateRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/order", orderRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at Port: ${port}`)
})