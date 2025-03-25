//users table.. -->userModel
// const RoleModel = require("../models/RoleModel")
const userModel = require("../models/UserModel")
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const { uploadFileToCloudinary } = require("../utils/CloudinaryUtil"); 
const { sendingMail } = require("../utils/MailUtil");
const jwt = require('jsonwebtoken');


const loginUser = async (req,res) => {

    //req.body email and password: password
    const email = req.body.email;
    const password = req.body.password;
    
    // const foundUserFromEmail =  userModel.findOne({email: req.body.email})
    const foundUserFromEmail = await userModel.findOne({email:email}).populate("roleId")
    console.log(foundUserFromEmail);

    //check if email exists or not
    if(foundUserFromEmail != null){
        //password
        //normal - plain req.body --- database --> match --> true | false
        //const isMatch = bcrypt.compareSync(req.body.password, foundUserFromEmail.password)
        const isMatch = bcrypt.compareSync(password, foundUserFromEmail.password);
        //true | false
        if(isMatch == true){
            res.status(200).json({
                message: "login success",
                data: foundUserFromEmail
            });
        } else{
            res.status(404).json({
                message: "Invalid credentials",
            });
        }
    } else{
        res.status(404).json({
            message: "Email not found.."
        });
    }
    
};

const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, roleId, phoneNumber, gender } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Check if the email already exists
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        // Password encryption
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        req.body.password = hashedPassword;

        // Create user
        const createdUser = await userModel.create(req.body);

        // Send welcome email
        const emailHtml = `
            <h1>Welcome to Wear Web!</h1>
            <p>Dear Fashion Enthusiast,</p>
            <p>Thank you for signing up with <strong>Wear Web</strong>—your ultimate destination for the latest trends in fashion!</p>
            <p>Explore a curated collection of stylish apparel, accessories, and more. Stay ahead of the trends with exclusive deals, personalized recommendations, and seamless shopping.</p>
            <p>Have any questions or need styling tips? Our support team is here to help!</p>
            <p>Happy shopping!</p>
            <p><strong>The Wear Web Team</strong></p>
        `;

        try {
            await sendingMail(createdUser.email, 'Welcome to Wear Web!', emailHtml);
            console.log("✅ Welcome email sent to:", createdUser.email);
        } catch (error) {
            console.error("❌ Failed to send welcome email:", error);
        }
            

        

        res.status(201).json({
            message: "User created successfully!",
            data: createdUser
        });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

//getAllUsers
const getAllUsers = async(req, res) => {
    const users = await userModel.find().populate("roleId");
    res.status(200).json({
        message: "Users fetched successfully...",
        data: users
    });
};

//addUser
const addUser = async(req, res) => {
    const savedUser = await userModel.create(req.body)

    res.json({
        message:"User saved successfully...",
        data: savedUser
      });
};

// Update user by ID
const updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;
  
      // Check if the user exists
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Upload profile picture to Cloudinary if provided
      if (req.file) {
        const result = await uploadFileToCloudinary(req.file, "wear-web/users"); // Use "wear-web/users" folder
        updateData.profilePicture = result.secure_url; // Save the Cloudinary URL
      }
  
      // Update the user
      const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validators on update
      });
  
      res.status(200).json({
        message: "User updated successfully!",
        data: updatedUser,
      });
    } catch (err) {
      console.error("Failed to update user:", err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
  };

//deleteUserById
const deleteUserById = async(req, res) => {

    const deletedUser  = await userModel.findByIdAndDelete(req.params.id)

    res.json({
        message:"User deleted successfully..",
        data: deletedUser
      })
}

//getUserById
const getUserById =async(req, res) => {

    const foundUser = await userModel.findById(req.params.id)
    res.json({
      message:"User fetched..",
      data:foundUser
    })
}

const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const foundUser = await userModel.findOne({email:email});
        if(!foundUser){
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        // Token expires in 1 hour
        const token = jwt.sign(
            {
                _id: foundUser._id,          
                purpose: "password_reset",   
                exp: Math.floor(Date.now() / 1000) + 3600 // 1-hour expiry
            },
            process.env.JWT_SECRET          
        );
        
        const url = `http://localhost:5173/resetpassword/${token}`;
        const mailContent = `
            <html>
                <body>
                    <h2>Password Reset Request</h2>
                    <p>You requested to reset your password. Click the link below to proceed:</p>
                    <a href="${url}">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </body>
            </html>
        `; 
        
        await sendingMail(foundUser.email, "Password Reset Request", mailContent);
        
        res.json({
            message: "Reset password link has been sent to your email.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ 
            message: "Failed to process forgot password request.",
            error: error.message 
        });
    }
}


const resetPassword = async(req, res) => {
    try {
        const token = req.body.token;
        const newPassword = req.body.password;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required." });
        }

        // Verify token
        const userFromToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Hash new password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        // Update user password
        const updatedUser = await userModel.findByIdAndUpdate(
            userFromToken._id,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({
            message: "Password updated successfully!",
        });
    } catch (error) {
        console.error("Password reset error:", error);
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Invalid or expired token." });
        }
        
        res.status(500).json({ 
            message: "Internal server error during password reset.",
            error: error.message 
        });
    }
};

//exports
module.exports = {
    getAllUsers,
    addUser,
    deleteUserById,
    getUserById,
    updateUser,
    signup,
    loginUser,
    forgotPassword,
    resetPassword
}
