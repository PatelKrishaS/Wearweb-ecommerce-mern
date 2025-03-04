//users table.. -->userModel
// const RoleModel = require("../models/RoleModel")
const userModel = require("../models/UserModel")
const bcrypt = require("bcrypt");

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
    //try catch if else..
    try{
        
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

        //password encrypt..
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        req.body.password = hashedPassword;

        // Create user
        const createdUser = await userModel.create(req.body);
        res.status(201).json({
            message: "User created...",
            data: createdUser
        });

    } catch(err){
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
    res.json({
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
      message:"role fetched..",
      data:foundUser
    })
}


//exports
module.exports = {
    getAllUsers,
    addUser,
    deleteUserById,
    getUserById,
    signup,
    loginUser
}