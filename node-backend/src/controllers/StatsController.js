const mongoose = require("mongoose");
const productModel = require("../models/ProductListingModel");
const orderModel = require("../models/OrderModel");
const userModel = require("../models/UserModel");

const getTopCategories = async (req, res) => {
  console.log("Fetching top categories...");
  try {
    const result = await orderModel.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.categoryId",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: "$categoryDetails._id",
          categoryName: { $first: "$categoryDetails.name" },
          orderCount: { $sum: 1 },
          totalRevenue: { 
            $sum: { 
              $multiply: ["$products.unitPrice", "$products.quantity"] 
            } 
          }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: 4 }
    ]);

    console.log("Categories result:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getTopCategories:", err);
    res.status(500).json({ 
      message: "Failed to fetch top categories", 
      error: err.message 
    });
  }
};

const getCustomerStats = async (req, res) => {
  console.log("Fetching customer stats...");
  try {
    // Get the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Get new customers (created in last 6 months)
    const newCustomers = await userModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          roleId: new mongoose.Types.ObjectId("67c6afff789c928be79e7426") // Customer role
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Get returning customers (placed orders in last 6 months but created before that)
    const returningCustomers = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: "Cancelled" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $match: {
          "user.createdAt": { $lt: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format the response
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    
    const months = [];
    const newCustomerData = [];
    const returningCustomerData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      months.push(monthNames[date.getMonth()]);
      
      // Find matching month in newCustomers
      const newCustMonth = newCustomers.find(m => 
        m._id.month === date.getMonth() + 1 && 
        m._id.year === date.getFullYear()
      );
      newCustomerData.push(newCustMonth ? newCustMonth.count : 0);
      
      // Find matching month in returningCustomers
      const retCustMonth = returningCustomers.find(m => 
        m._id.month === date.getMonth() + 1 && 
        m._id.year === date.getFullYear()
      );
      returningCustomerData.push(retCustMonth ? retCustMonth.count : 0);
    }

    console.log("Customer stats result:", { months, new: newCustomerData, returning: returningCustomerData });
    res.status(200).json({
      months,
      new: newCustomerData,
      returning: returningCustomerData
    });
  } catch (err) {
    console.error("Error in getCustomerStats:", err);
    res.status(500).json({ 
      message: "Failed to fetch customer stats", 
      error: err.message 
    });
  }
};

const getSalesStats = async (req, res) => {
  console.log("Fetching sales stats...");
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const salesData = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: "Cancelled" }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    
    const months = [];
    const sales = [];
    const orders = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      months.push(monthNames[date.getMonth()]);
      
      const found = salesData.find(item => 
        item._id.year === date.getFullYear() && 
        item._id.month === date.getMonth() + 1
      );
      
      sales.push(found ? found.totalSales : 0);
      orders.push(found ? found.orderCount : 0);
    }

    console.log("Sales stats result:", { months, sales, orders });
    res.status(200).json({
      months,
      sales,
      orders
    });
  } catch (err) {
    console.error("Error in getSalesStats:", err);
    res.status(500).json({ 
      message: "Failed to fetch sales stats", 
      error: err.message 
    });
  }
};

module.exports = {
  getTopCategories,
  getCustomerStats,
  getSalesStats
};