//to,from,subject,text
const mailer = require('nodemailer');

///function


const sendingMail = async (to, subject, text) => {
    try {
        const transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: "kaizennova55@gmail.com",
                pass: "dilt lfre vota yjpl"  // Replace with the correct App Password
            }
        });

        const mailOptions = {
            from: 'kaizennova55@gmail.com',
            to: to,
            subject: subject,
            text: text
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("✅ Email Sent Successfully:", mailResponse);
        return mailResponse;
    } catch (error) {
        console.error("❌ Error Sending Email:", error);
    }
};

// Run the function and see the output
sendingMail("samantha16sp@yopmail.com", "Test Email", "This is a test email!");