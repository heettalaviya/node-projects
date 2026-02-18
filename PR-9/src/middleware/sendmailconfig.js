const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
            user: "denishadashlani@gmail.com",
            pass: "fqqmrertncoxtbwz"
        }
})

const sendEmail = async (message) => {
    let res = await transporter.sendMail(message);
    console.log(res);
}

module.exports = sendEmail;

