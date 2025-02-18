const statisticalService = require("../services/statistical.service")
const asyncHandler = require('express-async-handler');

const overviewOrder = asyncHandler(async (req, res) => {
  const data = await statisticalService.overviewOrder()
  res.json({
    status:"success",
    data
  })
});

const orderDate = asyncHandler(async (req, res) => {
  const data = await statisticalService.orderDate(req)
  res.json({
    status:"success",
    data
  })
});

module.exports = {overviewOrder, orderDate};