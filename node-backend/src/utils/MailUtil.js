//to,from,subject,text
const mailer = require('nodemailer');

///function


const sendingMail = async (to, subject, html) => {
    try {
        const transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD  
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            // text: text
            html: html
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("✅ Email Sent Successfully:", mailResponse);
        return mailResponse;
    } catch (error) {
        console.error("Error Sending Email:", error);
    }
};

module.exports = { sendingMail };
