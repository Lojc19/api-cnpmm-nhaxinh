const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.MAIL_ID,
        pass: process.env.MP,
      },
      });
      // async..await is not allowed in global scope, must use a wrapper
        // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"LC Home" <bblojc@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.link, // html body
    });

    console.log("Message sent: %s", info.messageId);
});

const sendEmailCreateOrder = asyncHandler(async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
    });
    // async..await is not allowed in global scope, must use a wrapper
      // send mail with defined transport object
  const info = await transporter.sendMail({
      from: '"LC Home" <bblojc@gmail.com>', // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      text: data.text, // plain text body
      html: data.link, // html body
  });
});

module.exports = {sendEmail, sendEmailCreateOrder};