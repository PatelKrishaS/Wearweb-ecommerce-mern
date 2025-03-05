const routes = require("express").Router();
const categoryController = require("../controllers/CategoryController");

routes.get("/categories", categoryController.getAllCategories);
routes.get("/category/:id", categoryController.getCategoryById);
routes.post("/category", categoryController.addCategory);
routes.delete("/category/:id", categoryController.deleteCategoryById);

module.exports = routes;
