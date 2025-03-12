const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config();

//express object
const app = express();
app.use(cors())
app.use(express.json()) //to accept data as json...

//import role routes
const roleRoutes = require("./src/routes/RoleRoutes")
app.use(roleRoutes)

//userRoutes
const userRoutes = require("./src/routes/UserRoutes")
app.use(userRoutes)

const stateRoutes = require("./src/routes/StateRoutes")
app.use("/state", stateRoutes)
//Instead of     http://localhost:3000/addState   should use: 
//http://localhost:3000/state/addState

const cityRoutes = require("./src/routes/CityRoutes")
app.use("/city",cityRoutes) //http://localhost:3000/city/addCity

const userAddressRoutes = require("./src/routes/UserAddressRoutes")
app.use("/user-address",userAddressRoutes) //http://localhost:3000/city/addUserAddress

const categoryRoutes = require("./src/routes/CategoryRoutes")
app.use("/category",categoryRoutes) 

const subcategoryRoutes = require("./src/routes/SubCategoryRoutes")
app.use("/subcategory",subcategoryRoutes) 

const areaRoutes = require("./src/routes/AreaRoutes")
app.use("/area",areaRoutes) 

const productListingRoutes = require("./src/routes/ProductListingRoutes")
app.use("/product",productListingRoutes) 



mongoose.connect("mongodb://localhost:27017/MyDatabase").then(()=>{
    console.log("database connected....")
})


//server creation
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server started on port number", PORT);
    
})



