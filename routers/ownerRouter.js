const express = require("express");
const ownerModel = require('../models/ownerModel');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const isOwner = require("../middlewares/isOwner");


if (process.env.NODE_ENV === 'development') {
    router.post("/createowner", async (req, res) => {

        let owners = await ownerModel.find();
        if (owners.length > 0) return res.status(400).send('owner already exist ')

        let { name, email, password } = req.body;

        bcrypt.genSalt(12, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                let creadedowner = await ownerModel.create({
                    name,
                    email,
                    password: hash

                })

                let ownerid = jwt.sign({ email, ownerid: creadedowner._id }, process.env.JWT_KEY);

                res.cookie("userid", ownerid, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'development',
                    sameSite: "lax",
                    maxAge: 1 * 24 * 60 * 60 * 1000
                })

            })
        })

    })
}

router.get('/listproduct', (req, res) => {
    let queryMessage = req.query.message;
    res.render('listProduct', { queryMessage });
})

router.get('/sales', isOwner, async (req, res) => {
    try {
        // Fetch all users and their orders
        const users = await userModel.find().populate('orders.product');

        // Aggregate sales data
        const salesData = [];
        users.forEach(user => {
            user.orders.forEach(order => {
                if (order.product) {
                    salesData.push({
                        date: order.date,
                        price: order.product.price
                    });
                }
            });
        });

        // Sort by date
        salesData.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.render('sales', { salesData });
    } catch (err) {
        console.log("Error fetching sales data:", err);
        res.redirect("/?message=Error+fetching+sales+data&type=error");
    }
});

module.exports = router;