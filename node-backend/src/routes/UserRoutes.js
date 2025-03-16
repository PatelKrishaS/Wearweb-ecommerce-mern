//router
const routes = require("express").Router()

//controller --> userController
const userController = require("../controllers/UserController")

// routes.post("/user", userController.addUser)
routes.get("/users", userController.getAllUsers)
routes.delete("/user/:id", userController.deleteUserById)
routes.get("/user/:id", userController.getUserById)
routes.post("/user", userController.signup)
routes.post("/user/login", userController.loginUser)
routes.put("/user/:id", userController.updateUser);

module.exports = routes