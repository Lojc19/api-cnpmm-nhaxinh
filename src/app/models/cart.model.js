const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
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
    cartTotal: Number,
    totalAfterDiscount: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "carts",
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);