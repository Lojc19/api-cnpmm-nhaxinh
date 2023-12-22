const Product = require("../models/product.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");
const slugify = require("slugify");
const {deleteImages} = require("../../config/cloudinary");

const createProduct = asyncHandler(async (req) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const productNew = await Product.create({
      code: req.body.code,
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
      images: req.files.map(item => ({ url: item.path })),
      // images: req.body.images,
      category: req.body.category,
      room: req.body.room,
      specs: JSON.parse(req.body.specs),
      price: req.body.price,
      priceSale: req.body.price,
      quantity: req.body.quantity
    });
    return productNew;
  } catch (error) {
    deleteImages(req.files)
    throw new Error("Thêm sản phẩm thất bại kiểm tra lại code, name hoặc thiếu thông tin nào không");
  }
});

const updateProduct = asyncHandler(async (req) => {
  try {
    const { _id } = req.params;
    const dataUpdate = req.body;
    validateMongoDbId(_id);
    let product = await Product.findById(_id);
    await Product.findOneAndUpdate({_id: _id}, dataUpdate, {
      new: true,
    });

    if(dataUpdate.price)
    {
      if(dataUpdate.sale)
      {
        console.log("o day ne")
        product.priceSale = dataUpdate.price * ((100 - dataUpdate.sale) / 100);
      }
      else {
        product.priceSale = dataUpdate.price;
      }
    }
    else {
      if(dataUpdate.sale != 0)
      {
        product.priceSale = product.price * ((100 - dataUpdate.sale) / 100);
      }
      else {
        product.priceSale = product.price;
      }
    }

    await product.save()
    return null
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params;
  validateMongoDbId(id);
  try {
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getaProduct = asyncHandler(async (_id) => {
  try {
    const findProduct = await Product.findOne({_id: _id},{
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
      sold: 0,
      enable: 0,
    }).sort({createdAt: -1}).populate("category", "nameCate icUrl").populate("room", "nameRoom");
    return findProduct;
  } catch (error) {
    throw new Error(error);
  }
});

const searchProduct = asyncHandler(async (req) => {
  try {
    const {s} = req.params; 
    const searchResult = await Product.find({ name: { $regex: new RegExp(s, 'i') }, enable: true }, {
      sold: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
      enable: 0,
    }).sort({createdAt: -1}).populate("category", "nameCate icUrl").populate("room", "nameRoom");
    return searchResult;
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req) => {
  try {
    // pagination
    let page = req.query.page || 1;
    let limit = req.query.limit || 100;

    let filter = {
      enable: true,
    }
    let sort = {}
    
    /// sort
    if(req.query.sort_popular)
    {
      sort = {...sort, sold: -1};
    }
    if(req.query.sort_price)
    {
      if(req.query.sort_price == "desc")
      {
        sort = {...sort, priceSale: -1};
      }
      if(req.query.sort_price == "asc")
      {
        sort = {...sort, priceSale: 1};
      }
    }

    // filter
    if(req.query.specs_k && req.query.specs_v)
    {
      filter = {...filter, specs: { $elemMatch: { k: req.query.specs_k, v: req.query.specs_v }}}
    }
    if(req.query.category)
    {
      filter = {...filter, category: req.query.category};
    }
    if(req.query.room)
    {
      filter = {...filter, room: req.query.room};
    }

    let productCount = 0
    productCount = await Product.countDocuments(filter);
    if (req.query.page) {
      if (((page - 1) * limit) >= productCount) throw new Error("This Page does not exists");
    }
    const product = await Product.find(filter,{
      sold: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
      enable: 0,
    }).sort(sort).skip((page - 1) * limit).limit(limit).populate("category", "nameCate").populate("room", "nameRoom icUrl");;
    const data = {
      total: productCount,
      product,
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProductAdmin = asyncHandler(async (req) => {
  try {
    // pagination
    // let page = req.body.page || 1;
    // let limit = req.body.limit || 20;

    let filter = {
    }
    // if(req.body.category)
    // {
    //   filter = {...filter, category: req.body.category}
    // }
    // if(req.body.room)
    // {
    //   filter = {...filter, room: req.body.room}
    // }
    // if (req.body.page) {
    //   const productCount = await Product.countDocuments();
    //   if (((page - 1) * limit) >= productCount) throw new Error("This Page does not exists");
    // }

    const product = await Product.find(filter,{
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    }).sort({createdAt: -1}).populate("category", "nameCate").populate("room", "nameRoom icUrl");
    // skip((page - 1) * limit).limit(limit);;
    return product;
  } catch (error) {
    throw new Error(error);
  }
});

const getProductCategory = asyncHandler(async (id) => {
  try {
    const products = await Product.find({category: id, enable: true}, {
      sold: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
      enable: 0,
    }).sort({createdAt: -1}).populate("category", "nameCate").populate("room", "nameRoom icUrl");
    return products;
  } catch (error) {
    throw new Error(error);
  }
});

const getProductRoom = asyncHandler(async (id) => {
  try {
    const product = await Product.find({room: id, enable: true},{
      sold: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
      enable: 0,
      }).sort({createdAt: -1}).populate("category", "nameCate").populate("room", "nameRoom");
    return product;
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImageProduct = asyncHandler(async (req) => {
  try {
    console.log(req.file)
    return "Ok"
  } catch (error) {
    throw new Error(error);
  }
});


module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductCategory,
  getProductRoom,
  searchProduct,
  getAllProductAdmin,
  uploadImageProduct
};