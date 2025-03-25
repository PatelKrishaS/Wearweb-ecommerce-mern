const routes = require("express").Router()
const userController = require("../controllers/UserController")
const upload = require("../utils/MulterConfig");

// routes.post("/user", userController.addUser)
routes.get("/users", userController.getAllUsers)
routes.delete("/user/:id", userController.deleteUserById)
routes.get("/user/:id", userController.getUserById)
routes.post("/user", userController.signup)
routes.post("/user/login", userController.loginUser)
// Update user by ID (with profile picture upload and other details)
routes.put("/user/:id", upload.single("profilePicture"), userController.updateUser);
routes.post("/user/forgotpassword", userController.forgotPassword)
routes.post("/user/resetpassword", userController.resetPassword)

module.exports = routes
