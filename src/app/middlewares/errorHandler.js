// not Found

const notFound = (req, res, next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);
    res.status(404);
    next(error);
  };

  // Error Handler
  
const errorHandler = (err, req, res, next) => {
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statuscode);
    let message = err?.message;
    if (message && message.startsWith("Error:")) {
        message = message.substring(6).trim(); // Loại bỏ "Error:" và khoảng trắng sau đó
    }
    res.json({
      status: "fail",
      message: message,
      stack: err?.stack,
    });
  };

module.exports = { errorHandler, notFound };