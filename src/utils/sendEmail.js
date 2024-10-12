const nodemailer = require("nodemailer");

const transporterOptins = {
  service: process.env.SERVICE,
  port: process.env.EMAILPORT,
  secure: true,
  host: process.env.HOST,
  auth: {
    user: process.env.USEREMAIL,
    pass: process.env.USERPASSWORD,
  },
};

const transporter = nodemailer.createTransport(transporterOptins);

const sendEmail = async (option) => {
  await transporter.sendMail({
    from: process.env.USEREMAIL,
    to: option.mailTo,
    subject: option.subject,
    html: option.html,
  });
};

module.exports = sendEmail;
