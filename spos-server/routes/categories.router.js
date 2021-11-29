const express  = require("express");
const router   = express.Router();
const Category = require('../models/category');

router.get("/all", async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(res.statusCode).json(categories)
    } catch (error) {
        return res.status(res.statusCode).json({message : error.message});
    }
});
router.post("/new", async (req, res) => {
    const {name, price, tax} = req.body;
    try {
        const category = await Category.create({name, price, tax});
        return res.status(res.statusCode).json(category)
    } catch (error) {
        if(error.code===11000)
            return res.status(401).json({message : 'Category "'+name+'" already exist.'});
        else
            return res.status(401).json({message : error.message});
    }
});
router.put("/update", async (req, res) => {
    res.json({});
});
router.delete("/remove", async (req, res) => {
    res.json({});
});

module.exports = router;