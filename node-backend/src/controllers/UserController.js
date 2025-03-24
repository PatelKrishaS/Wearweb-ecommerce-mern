//users table.. -->userModel
// const RoleModel = require("../models/RoleModel")
const userModel = require("../models/UserModel")
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const { uploadFileToCloudinary } = require("../utils/CloudinaryUtil"); 

const loginUser = async (req,res) => {
    //req.body email and password: password

    //password --> plain --> db --> encrypted
    //bcrypt --> plain, enc --> match : true
    const email = req.body.email;
    const password = req.body.password;
    //select * from users where email =? and password = ?
    //userModel.find({email:email, password:password})
    //email --> object --> abc --{password:hashedPassword}
    //normal password compare -->

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
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "kaizennova55@gmail.com", 
                pass: "dilt lfre vota yjpl" // App Password
            }
        });

        const mailOptions = {
            from: 'kaizennova55@gmail.com',
            to: email,
            subject: 'Welcome to Wear Web!',
            html: `
                <h1>Welcome to Wear Web!</h1>
                <p>Dear Fashion Enthusiast,</p>
                <p>Thank you for signing up with <strong>Wear Web</strong>—your ultimate destination for the latest trends in fashion!</p>
                <p>Explore a curated collection of stylish apparel, accessories, and more. Stay ahead of the trends with exclusive deals, personalized recommendations, and seamless shopping.</p>
                <p>Have any questions or need styling tips? Our support team is here to help!</p>
                <p>Happy shopping!</p>
                <p><strong>The Wear Web Team</strong></p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Welcome email sent to:", email);

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


//exports
module.exports = {
    getAllUsers,
    addUser,
    deleteUserById,
    getUserById,
    updateUser,
    signup,
    loginUser
}
