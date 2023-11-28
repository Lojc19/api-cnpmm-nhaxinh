const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      require: true,
    },
    images: [
      {
        url: String,
      }
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Category"
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Room"
    },
    specs: [
      {
        k: String,
        v: String,
      }
    ],
    price: {
      type: Number,
      required: true,
    },
    sale: {
      type: Number,
      default: 0,
    },
    priceSale: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },

    totalrating: {
      type: String,
      default: 0,
    }
  },
  {
    collection: "products",
    timestamps: true
  }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);