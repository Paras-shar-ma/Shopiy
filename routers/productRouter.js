const express = require("express");
const upload = require("../config/multer-connection");
const productModel = require('../models/productModel')

const router = express.Router();

router.get('/product/:productid', async (req, res) => {
    const queryMessage = req.query.message;
    const type = req.query.type;
    let product = await productModel.findOne({ _id: req.params.productid })
    res.render('product', { product, queryMessage })
})
router.post('/create', upload.single('productimage'), async (req, res) => {
    try {
        let { productname, description, price, discount } = req.body;
        if (!productname || !description || !price || !discount) {

            return res.redirect("/owner/listproduct?message=All+fields+required&type=error");
        }

        const product = await productModel.findOne({ productname })
        if (product)
            return res.redirect("/owner/listproduct?message=Product+already+exists")

        let createdProduct = await productModel.create({
            image: req.file.buffer,
            name: productname,
            description,
            price,
            discount
        })

        res.redirect('/?message=Product+is+listed&type=success')
    } catch (err) {
        console.log("error during listing product ", err)
        return res.redirect('/owner/listproduct?message=Some+error+occurs&type=error')
    }

})


router.get('/delete/:productid', async (req, res) => {
    let deletedProduct = await productModel.findOneAndDelete({ _id: req.params.productid })
    res.redirect("/");

})

router.get('/outofstock/:productid', async (req, res) => {
    try {
        let product = await productModel.findOne({ _id: req.params.productid });
        if (product) {
            product.isOutOfStock = !product.isOutOfStock;
            await product.save();
        }
        res.redirect("/");
    } catch (err) {
        console.log("Error toggling out of stock status:", err);
        res.redirect("/?message=Error+toggling+status&type=error");
    }
});

module.exports = router;