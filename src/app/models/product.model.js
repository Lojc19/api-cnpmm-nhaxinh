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
    description: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        require: true,
    },
    images: {
      type: Array,
      defaul: [],
    },
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
      defaul: 0,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: {
      type: String,
      default: 0,
    },
    realease_date: {
      type: Date,
      default: Date.now,
      require: true,
    }
  },
  {
    collection: "products", 
    timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);