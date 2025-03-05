const routes = require("express").Router();
const subCategoryController = require("../controllers/SubCategoryController");

routes.post("/subcategory", subCategoryController.addSubCategory);
routes.get("/subcategories", subCategoryController.getAllSubCategories);
routes.get("/subcategory/:id", subCategoryController.getSubCategoryById);
routes.delete("/subcategory/:id", subCategoryController.deleteSubCategoryById);

module.exports = routes;
