const statisticalService = require("../services/statistical.service")
const asyncHandler = require('express-async-handler');

const overviewStatistical = asyncHandler(async (req, res) => {
  const data = await statisticalService.overviewStatistical()
  res.json({
    status:"success",
    data
  })
});

module.exports = {overviewStatistical};