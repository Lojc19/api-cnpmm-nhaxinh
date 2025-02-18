const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../../utils/validateMongodbId");

const addtoCart = asyncHandler(async (req) => {
    const { productId, quantity } = req.body;
    if(quantity >= 2)
    {
      throw new Error("Giới hạn 1 sản phẩm, nếu có nhu cầu mua số lượng lớn vui lòng liên hệ qua hotline")
    }
    const userId = req.user._id; //TODO: the logged in user id
  
    try {
      let cart = await Cart.findOne({ userId });
      let product = await Product.findById(productId) // product trong db
      
      if (cart) {
        //cart exists for user
        let itemIndex = cart.products.findIndex(p => p.product == productId);
  
        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          throw new Error("Bạn không thể thêm vào giỏ hàng, giới hạn 1 sản phẩm, nếu có nhu cầu mua số lượng lớn vui lòng liên hệ qua hotline")
          // let productItem = cart.products[itemIndex]; // product trong cart
          // if(productItem.quantity + quantity <= product.quantity)
          // {
          //   productItem.quantity = productItem.quantity + quantity;
          //   productItem.totalPriceItem = product.priceSale * productItem.quantity;
          //   cart.products[itemIndex] = productItem;
          // }
          // else {
          //   throw new Error("Số lượng không khả dụng")
          // }
        } else {
          if(product.quantity > 0)
          {
            totalPriceItem = product.priceSale * quantity;
            //product does not exists in cart, add new item
            cart.products.push({ product, quantity, totalPriceItem});
          }
          else {
            throw new Error("Số lượng không khả dụng")
          }
        }
        let cartTotal = 0;
        for (let i = 0; i < cart.products.length; i++) {
          cartTotal = cartTotal + cart.products[i].totalPriceItem;
        }
        cart.cartTotal = cartTotal;
        cart = await cart.save();
        const getcart = await getCart(req);
        return getcart;
      } else {
        if(quantity > product.quantity)
        {
          throw new Error("Số lượng không khả dụng")
        }
        totalPriceItem = product.priceSale * quantity;
        cartTotal = totalPriceItem;
        //no cart for user, create new cart
        const newCart = await Cart.create({
          userId,
          products: [{ product, quantity, totalPriceItem}],
          cartTotal,
        });
        const getcart = await getCart(req);
        return getcart;
      }
    } catch (err) {
        throw new Error(err);
    }
});

const getCart = asyncHandler(async (req) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      let cart = await Cart.findOne({ userId: _id }).populate({path: "products.product", select:'name priceSale enable'});
      if(!cart)
      {
        return []
      }

      for (let i = 0; i < cart.products.length; i++) {
        if(cart.products[i].product.enable == false){
          cart.products.splice(i,1);
          await cart.save();
          // throw new Error("Sản phẩm " + `${cart.products[i].product.name}` + " hiện không khả dụng" ); 
        }
      }
      
      let cartTotal = 0;
      for (let i = 0; i < cart.products.length; i++) {
        cart.products[i].totalPriceItem = cart.products[i].quantity * cart.products[i].product.priceSale;
        cartTotal = cartTotal + cart.products[i].totalPriceItem;
      }
      cart.cartTotal = cartTotal;
      cart = await cart.save();

      const getcart = await Cart.findOne({ userId: _id },{
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        userId: 0,
      }).populate({path: "products.product", select:'name description images specs priceSale'});
      return getcart;
    } catch (error) {
      throw new Error(error);
    }
});

// }).populate({path: "products.product", select:'name shortDescription images price priceSale'});

const emptyCart = asyncHandler(async (req) => {
    const { _id } = req.user;
    try {
      const findCart = await Cart.findOne({userId: _id});
      if(findCart)
      {
        const data = await Cart.findOneAndDelete({ userId: _id });
        return []
      }
    } catch (error) {
      throw new Error(error);
  }
});
// if(update == "delete")
// {
//   cart.cartTotal = cart.cartTotal - cart.products[itemIndex].totalPriceItem;
//   cart.products.splice(itemIndex,1);
//   // cart = await cart.save();
//   if(cart.products.length == 0)
//   {
//     await Cart.findOneAndRemove({ userId });
//     return null
//   }
// }
const updateCart = asyncHandler(async (req) => {
  const { quantity, productId } = req.body;
  if(quantity > 1)
  {
    throw new Error("Giới hạn 1 sản phẩm, nếu có nhu cầu mua số lượng lớn vui lòng liên hệ qua hotline");
  }
  const userId = req.user._id; //TODO: the logged in user id
  try {
    let cart = await Cart.findOne({ userId });
    let getProduct = await Product.findById(productId)

    if (cart) {
      let itemIndex = cart.products.findIndex(p => p.product == productId);
      if(itemIndex > -1)
      {
        if(quantity == 0)
        {
          cart.cartTotal = cart.cartTotal - cart.products[itemIndex].totalPriceItem;
          cart.products.splice(itemIndex,1);
          // cart = await cart.save();
          if(cart.products.length == 0)
          {
            await Cart.findOneAndDelete({ userId });
            return []
          }
        }
        else {
          if(quantity <= getProduct.quantity)
          {
            cart.products[itemIndex].quantity = quantity;
            cart.products[itemIndex].totalPriceItem = getProduct.priceSale * cart.products[itemIndex].quantity;
              // cart = await cart.save();
          }
          else {
            throw new Error("Số lượng không khả dụng")
          }
        }

        let cartTotal = 0;
        for (let i = 0; i < cart.products.length; i++) {
          cartTotal = cartTotal + cart.products[i].totalPriceItem;
        }
        cart.cartTotal = cartTotal;
        cart = await cart.save();
        const getcart = await getCart(req);
        return getcart;
      }
      else {
        throw new Error("Không tìm thấy sản phẩm trong giỏ hàng")
      }
    }
    else {
      throw new Error("Cart null");
    }
  } catch (err) {
      throw new Error(err);
  }
});


module.exports = {addtoCart, getCart, emptyCart, updateCart};