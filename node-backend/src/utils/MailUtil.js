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
            // text: text
            html: `<h1>Welcome to Wear Web!</h1>
            <p>Dear Fashion Enthusiast,</p>
            <p>Thank you for signing up with <strong>Wear Web</strong>—your ultimate destination for the latest trends in fashion!</p>
            <p>Explore a curated collection of stylish apparel, accessories, and more. Stay ahead of the trends with exclusive deals, personalized recommendations, and seamless shopping.</p>
            <p>Have any questions or need styling tips? Our support team is here to help!</p>
            <p>Happy shopping!</p>
            <p><strong>The Wear Web Team</strong></p>
`
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("✅ Email Sent Successfully:", mailResponse);
        return mailResponse;
    } catch (error) {
        console.error("❌ Error Sending Email:", error);
    }
};

// Run the function and see the output
sendingMail("patelamruta2673@gmail.com", "Test Email", "");