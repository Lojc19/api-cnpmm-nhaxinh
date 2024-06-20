const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true
    },
    PaymentMethod: {
        type: String,
        required: true,
    },
    PaymentStatus: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email:{
      type:String,
      required:true,
    },
    phoneNumber:{
      type:String,
      minlength: 10,
      maxlength: 10,
      required:true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        totalPriceItem: Number,
      },
    ],
    total: {
        type: Number,
        required: true,
    },
    addressShipping: {
      province: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      ward: {
        type: String,
        required: true,
      },
      note: {
        type: String,
        default: "",
      },
    },
    status: {
      type: String,
      default: "Processing",
      enum: [
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    orderTime: {
        type: Date,
        default: Date.now,
    },
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);