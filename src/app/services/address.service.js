const Address = require("../models/address.model");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../../utils/validateMongodbId");
const jwt = require("jsonwebtoken");

const createAddress = asyncHandler(async (req) => {
  try {
    const { _id } = req.user;
    const findAddress = await Address.find({userId: req.user._id})
    const checkName = findAddress.some(address => address.nameAddress === req.body.nameAddress);
    if(checkName)
    {
      throw new Error("Tên địa chỉ đã tồn tại")
    }
    if(findAddress)
    {
      if(req.body.default == true){
        await Address.findOneAndUpdate({userId: req.user._id, default: true}, {
          default: false
        }, 
        {
          new: true,
        });
      }
      await Address.create(
        {
          nameAddress: req.body.nameAddress,
          province: req.body.province,
          district: req.body.district,
          ward: req.body.ward,
          note: req.body?.note,
          default: req.body?.default,
          userId: _id
        });
    }
    else {
      await Address.create(
        {
          nameAddress: req.body.nameAddress,
          province: req.body.province,
          district: req.body.district,
          ward: req.body.ward,
          note: req.body?.note,
          default: true,
          userId: _id
        });
    }
    return
  } catch (error) {
    throw new Error(error);
  }
});

const getAddress = asyncHandler(async (req) => {
  try {
    const { _id } = req.user;
    const getAddress = await Address.find({userId: _id}, {
      userId: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    return getAddress
  } catch (error) {
    throw new Error(error);
  }
});

const updateAddress = asyncHandler(async (idAddress, req) => {
  try {
    if(req.body.default == true){
      await Address.findOneAndUpdate({userId: req.user._id, default: true}, {
        default: false
      }, 
      {
        new: true,
      });
    }
    await Address.findByIdAndUpdate(
      idAddress,
      {
        nameAddress: req.body?.nameAddress,
        province: req.body?.province,
        district: req.body?.district,
        ward: req.body?.ward,
        note: req.body?.note,
        default: req.body?.default,
      },
      {
        new: true,
      }
    );
    return
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAddress = asyncHandler(async (idAddress) => {
  try {
    const checkDefault = await Address.findById(idAddress);
    if(checkDefault.default == true)
    {
      throw new Error("Không thể xóa địa chỉ mặc định");
    }
    await Address.findOneAndDelete({_id: idAddress});
    return
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createAddress, getAddress, updateAddress, deleteAddress};