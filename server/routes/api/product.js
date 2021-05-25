const express = require("express");
const Product = require("../../models/product");
const router = express.Router();
const auth = require("../../middleware/auth");
const upload = require("../../utils/upload").single("image");

router.get("/", async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.get("/category/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const products = await Product.find({category: id}).populate("category");
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.get("/id/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const products = await Product.findById(id).populate("category");
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.get("/list", auth.isAuth, async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        res.status(200).json(products);
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

router.post("/add", auth.isAuth, async (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            res.status(400).json({
                error: "Your request could not be processed. Please try again."
            });
        } else {
            const {
                category,
                name,
                brandName,
                stock,
                price,
                summary,
                description,
                isActive,
                ...rest
            } = req.body;
            const image = req.file.filename;
            const userId = req.session._userId;
            const product = new Product({
                _userId: userId,
                category: category,
                name: name,
                brandName: brandName,
                stock: stock,
                price: price,
                summary: summary,
                description: description,
                image: image,
                isActive: isActive
            });
            product.save();
            res.status(200).json(product);
        }
    });
});

router.put("/update/:id", auth.isAuth, (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            res.status(400).json({
                error: "Your request could not be processed. Please try again."
            });
        } else {
            const {
                category,
                name,
                brandName,
                stock,
                price,
                summary,
                description,
                isActive,
                ...rest
            } = req.body;
            const newProduct = {
                category: category,
                name: name,
                brandName: brandName,
                stock: stock,
                price: price,
                summary: summary,
                description: description,
                isActive: isActive
            };
            if (req.file) {
                newProduct.image = req.file.filename;
            }
            const id = req.params.id;
            const product = await Product.findByIdAndUpdate(id, newProduct).catch((err) => console.log(err));
            res.status(200).json(product);
        }
    });
});

router.delete("/delete/:id", auth.isAuth, async (req, res) => {
    try {
        const id = req.params.id;
        await Product.findByIdAndDelete(id);
        res.status(200).json({});
    } catch {
        res.status(400).json({
            error: "Your request could not be processed. Please try again."
        });
    }
});

module.exports = router;