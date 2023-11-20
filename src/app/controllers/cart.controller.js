const asyncHandler = require('express-async-handler');
const cartService = require("../services/cart.service")

const jwt = require("jsonwebtoken");

const addtoCart = asyncHandler(async (req, res) => {
    const data = await cartService.addtoCart(req);
    res.json({
        status: "success",
    })
});

const getCart = asyncHandler(async (req, res) => {
    const data = await cartService.getCart(req);
    res.json({
        status: "success",
        data,
    })
});

const emptyCart = asyncHandler(async (req, res) => {
    const data = await cartService.emptyCart(req);
    res.json({
        status: "success",
    })
});

const updateCart = asyncHandler(async (req, res) => {
    const data = await cartService.updateCart(req);
    res.json({
        status: "success",
        data,
    })
});

module.exports = {addtoCart, getCart, emptyCart, updateCart};