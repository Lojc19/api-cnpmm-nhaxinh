const asyncHandler = require('express-async-handler');
const addressService = require("../services/address.service")
const jwt = require("jsonwebtoken");

const createAddress = asyncHandler(async (req, res) => {
    await addressService.createAddress(req);
    res.json({
        status: "success",
        data: null,
        message: "Thêm địa chỉ thành công"
    })
});

const getAddress = asyncHandler(async (req, res) => {
    const data = await addressService.getAddress(req);
    res.json({
        status: "success",
        data,
        message: "Lấy danh sách địa chỉ"
    })
});

const updateAddress = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    await addressService.updateAddress(_id,req);
    res.json({
        status: "success",
        data: null,
        message: "Cập nhật thành công"
    })
});

const deleteAddress = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    await addressService.deleteAddress(_id);
    res.json({
        status: "success",
        data: null,
        message: "Xóa thành công"
    })
});

module.exports = {createAddress, getAddress, updateAddress, deleteAddress};