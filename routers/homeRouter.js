const express = require("express");
const userModel = require("../models/userModel")
const productModel = require('../models/productModel')
const isLoggedIn = require("../middlewares/isLoggedIn");
const isOwner = require("../middlewares/isOwner");
const userDetails = require("../middlewares/userDetails");


const router = express.Router();

router.get("/", isOwner, async (req, res) => {
    try {
        const queryMessage = req.query.message;
        const products = await productModel.find();
        res.render("home", { queryMessage, products });
    } catch (err) {
        console.error("Error rendering home page:", err);
        res.status(500).send("Internal Server Error");
    }
})

router.get("/cart", isLoggedIn, userDetails, async (req, res) => {
    const products = await userModel.findById({ _id: req.details._id }).populate("cart");
    res.render("cart", { products })
})

router.get("/register", (req, res) => {
    let queryMessage = req.query.message;
    res.render("login", { queryMessage })
})

router.get("/profile", isOwner, userDetails, async (req, res) => {
    try {
        const Model = req.model;
        let user;
        if (req.model === userModel) {
            user = await Model.findOne({ email: req.details.email }).populate('orders.product');
        } else {
            user = await Model.findOne({ email: req.details.email });
        }

        let salesData = [];
        if (res.locals.isOwner) {
            const allUsers = await userModel.find().populate('orders.product');
            allUsers.forEach(u => {
                u.orders.forEach(order => {
                    if (order.product) {
                        salesData.push({
                            date: order.date,
                            price: order.product.price
                        });
                    }
                });
            });
            salesData.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        res.render("profile", { user, salesData, isOwner: res.locals.isOwner });
    } catch (err) {
        console.error("Error fetching profile data:", err);
        res.redirect("/?message=Error+loading+profile&type=error");
    }
});

router.get("/search", (req, res) => {

    res.render("home")
})
module.exports = router;