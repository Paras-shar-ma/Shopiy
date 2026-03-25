const mongoose = require('mongoose');
const express = require("express");
const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isOwner = require("../middlewares/isOwner");
const ownerModel = require("../models/ownerModel");
const upload = require("../config/multer-connection");
const userDetails = require("../middlewares/userDetails");
const isLoggedIn = require("../middlewares/isLoggedIn");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_not_saved');
const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    let { name, username, email, password } = req.body;
    let users = await userModel.findOne({ email: email });

    if (!name || !email || !password) {
      return res.redirect("/register?message=All+fields+required&type=error");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.redirect("/register?message=Invalid+email+format&type=error");
    }

    if (users) {
      return res.redirect('/register?message=user+alread+exists+please+Login&type=error')
    }
    bcrypt.genSalt(12, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        let user = await userModel.create({
          name,
          username,
          email,
          password: hash
        })
        let userid = jwt.sign({ email: email, userid: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });
        res.cookie("userid", userid, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'development',
          sameSite: "lax",
          maxAge: 1 * 24 * 60 * 60 * 1000
        });
        res.redirect("/?message=You+are+successfully+registered&type=success")
      })
    })
  } catch (err) {

    return res.redirect("/register?message=Something+went+wrong+try+again&type=error")
  }

})

router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.redirect("/register?message=All+fields+required&type=error");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.redirect("/register?message=Invalid+email+format&type=error");
    }

    const isOwner = await ownerModel.findOne({ email: email })

    const Model = isOwner ? ownerModel : userModel;
    let user = await Model.findOne({ email: email });
    if (!user) {
      return res.redirect('/register?message=User+did+not+exist+Please+Register&type=error');
    }
    bcrypt.compare(password, user.password, (err, result) => {

      if (result) {
        let userid = jwt.sign({ email: email, userid: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });
        res.cookie("userid", userid, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'development',
          sameSite: "lax",
          maxAge: 1 * 24 * 60 * 60 * 1000
        });

        res.redirect("/?message=You+are+successfully+Login&type=success")
      } else {
        return res.redirect("/register?message=something+is+wrong+try+again&type=error")
      }


    })
  }
  catch (err) {
    console.log("err in login", err)
  }

})

router.get('/logout', (req, res) => {
  try {

    res.clearCookie('userid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      sameSite: "lax"
    });

    res.redirect('/?message=You+are+logout+successfully');

  } catch (err) {
    console.log(err)
  }

});

router.post('/uploadProfile', userDetails, upload.single('image'), async (req, res) => {

  let user = await req.model.findOne({ email: req.details.email });
  await req.model.findByIdAndUpdate(req.details._id, {
    profilepic: req.file.buffer
  });
  res.redirect("/profile")
})

router.get('/edituser/:userid', userDetails, async (req, res) => {
  let user = await req.model.findOne({ _id: req.params.userid });
  res.render("edit", { user })
})

router.post("/updateProfile", userDetails, async (req, res) => {
  let { name, email, password } = req.body;

  if (!password || password.trim() == "")
    delete req.body.password;

  if (password && password.trim() !== "") {
    let salt = await bcrypt.genSalt(12);
    req.body.password = await bcrypt.hash(password, salt)
  }

  let newUser = await req.model.findOneAndUpdate({ _id: req.details._id }, req.body, { new: true })

  res.redirect("/profile")
})

router.get('/addtocart/:productid', isLoggedIn, userDetails, async (req, res) => {
  try {
    let user = req.details;
    let productid = req.params.productid;
    let product = await require('../models/productModel').findOne({ _id: productid });

    if (product.isOutOfStock) {
      return res.redirect(`/products/product/${productid}?message=Product+is+out+of+stock&type=error`);
    }

    let userCart = await userModel.findOneAndUpdate({ _id: user._id }, { $addToSet: { cart: productid } }, { new: true });
    return res.redirect(`/products/product/${productid}?message=Added+To+Cart&type=success`)

  } catch (err) {
    console.log(err);
    return res.redirect("/products/product?message=Something+went+wrong&type=error")
  }
})

router.get("/removetocart/:productid", userDetails, async (req, res) => {
  try {
    let user = req.details;
    let productid = req.params.productid;
    let usercart = await userModel.findOneAndUpdate({ _id: user._id }, { $pull: { cart: productid } }, { new: true });
    return res.redirect('/cart');

  } catch (error) {

    console.log(error);
    return res.redirect('/cart');
  }
})

router.get("/checkout", isLoggedIn, userDetails, async (req, res) => {
  try {
    let user = await userModel.findById(req.details._id).populate('cart');
    if (user.cart.length === 0) {
      return res.redirect("/cart?message=Cart+is+empty&type=error");
    }

    // Calculate line items for Stripe
    const lineItems = user.cart.map(product => {
      const price = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.name,
            description: product.description || 'Product from Shopiy',
          },
          unit_amount: Math.round(price * 100), // Stripe expects amounts in cents/paise
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // customer_email: user.email, // Removed to allow users to manually enter their email address
      invoice_creation: {
        enabled: true,
      },
      success_url: `${req.protocol}://${req.get('host')}/user/checkout/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    });

    res.redirect(session.url);
  } catch (error) {
    console.log("Error during checkout:", error);
    res.redirect(`/cart?message=${encodeURIComponent(error.message)}&type=error`);
  }
});

router.get("/checkout/success", isLoggedIn, userDetails, async (req, res) => {
  try {
    let user = await userModel.findById(req.details._id);
    
    if (user.cart.length > 0) {
      const newOrders = user.cart.map(productId => ({
        product: productId,
        date: new Date()
      }));

      user.orders.push(...newOrders);
      user.cart = [];
      await user.save();
    }
    res.redirect("/user/orders?message=Payment+successful!+Order+placed.&type=success");
  } catch (error) {
    console.log("Error during checkout success:", error);
    res.redirect("/cart?message=Order+processing+failed&type=error");
  }
});

router.get("/orders", isLoggedIn, userDetails, async (req, res) => {
  try {
    let user = await userModel.findById(req.details._id).populate("orders.product");
    res.render("orders", { user });
  } catch (error) {
    console.log("Error fetching orders:", error);
    res.redirect("/?message=Error+fetching+orders&type=error");
  }
});

module.exports = router;