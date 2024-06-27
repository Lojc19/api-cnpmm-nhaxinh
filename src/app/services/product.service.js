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
    if(!req.files){
      throw new Error("Miss input")
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
      quantity: req.body.quantity,
      enable: req.body.enable,
    });
    return productNew;
  } catch (error) {
    deleteImages(req.files)
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req) => {
  try {
    const { _id } = req.params;
    const dataUpdate = req.body;
    validateMongoDbId(_id);
    let product = await Product.findById(_id);
    if(!product)
    {
      throw new Error("Không tìm thấy product")
    }
    const updateFields = {};
    const arrayFilters = [];
    if(req.body.specs)
    {
      req.body.specs.forEach((spec, index) => {
        const placeholder = `elem${index}`;
        updateFields[`specs.$[${placeholder}].v`] = spec.v;
        arrayFilters.push({ [`${placeholder}.k`]: spec.k });
      });
    }

    let updateProduct = await Product.findOneAndUpdate({_id: _id}, {
      code: dataUpdate?.code,
      name: dataUpdate?.name,
      description: dataUpdate?.description,
      shortDescription: dataUpdate?.shortDescription,
      category: dataUpdate?.category,
      room: dataUpdate?.room,
      $set: updateFields,
      price: dataUpdate?.price,
      sale: dataUpdate?.sale,
      quantity: dataUpdate?.quantity,
      enable: dataUpdate?.enable,
    },
    {
      arrayFilters: arrayFilters,
      returnOriginal: false
    },
    {
      new: true,
    });

    if(dataUpdate.name)
    {
      updateProduct.slug = slugify(dataUpdate.name);
    }

    if(updateProduct.sale == 0){
      updateProduct.priceSale = updateProduct.price;
    }
    else {
      updateProduct.priceSale = updateProduct.price * ((100 - updateProduct.sale) / 100);
    }
    await updateProduct.save()
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

const getaProduct = asyncHandler(async (slug) => {
  try {
    const findProduct = await Product.findOne({slug: slug},{
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