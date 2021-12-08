const express  = require("express");
const router   = express.Router();
const Products = require('../models/products');
const Category = require('../models/category');
const auth     = require('../middleware/auth');

router.get("/all", auth, async (req, res) => {
    try {
        const uid   = req?.user.uid || '';
        const query = {uid: uid};
        const products = await Products.aggregate([
            { $lookup:
                {
                    from: 'categories',
                    localField: 'cat_id',
                    foreignField: '_id',
                    as: 'cat_detail'
                }
            },
        ])
        return res.status(200).json(products);
    } catch (error) {
        return res.status(res.statusCode).json({message : error.message});
    }
});

router.get("/one", auth, async (req, res) => {
    const { barcode } = req.query;
    const uid   = req?.user.uid || '';
    const query = {$and: [{code : barcode}, {uid : uid}]};
    try {
        const product = await Products.findOne(query);
        if(product){
            const cat = await Category.findById(product.cat_id);
            const response = {
                name   : product.name,
                price  : product.price,
                cat_id : product.cat_id,
                tax    : cat.tax
            }
            return res.status(200).json(response);
        }else{
            return res.status(401).json({message: 'Product not found'});
        }
    } catch (error) {
        return res.status(res.statusCode).json({message : error.message});
    }
});

router.post("/new", auth, async (req, res) => {
    const {name, code, price, cat_id} = req.body;
    const uid   = req?.user.uid || '';
    try {
        const findQuery = {$and: [{uid: uid}, {code:code}]};
        const is_exist = await Products.findOne(findQuery);
        if(is_exist===null){
            const product = await Products.create({uid, name, cat_id, code, price});
            if(product){
                const cat = await Category.findById(product?.cat_id);
                let response = {
                    _id     : product._id,
                    uid     : product.uid,
                    name    : product.name,
                    code    : product.code,
                    price   : product.price,
                    cat_id  : product.cat_id,
                    cat_detail : [cat]
                };
                return res.status(200).json(response)
            }
        }else{
            return res.status(401).json({message : 'Product "'+is_exist.name+'" with barcode "'+is_exist.code+'" already exist.'});
        }
    } catch (error) {
        return res.status(401).json({message : error.message});
    }
});

router.put("/update", auth, async (req, res) => {
    const {id, name, code, price, cat_id} = req.body;
    if(id==='') res.status(401).json({message: 'Product ID not found'});
    const uid   = req?.user.uid || '';
    const query = {$set: {name : name, code : code, price:price, cat_id:cat_id}};
    const findQuery = {$and: [{_id : id},{uid : uid}]};
    Products.findOneAndUpdate(findQuery, query, {returnOriginal : false}, async function(err, product){
        if(err){
            return res.status(500).json({message: 'Error Occured While Updating Product'});
        }
        if(product){
            const cat = await Category.findById(product?.cat_id);
            let response = {
                _id     : product._id,
                uid     : product.uid,
                name    : product.name,
                code    : product.code,
                price   : product.price,
                cat_id  : product.cat_id,
                cat_detail : [cat]
            };
            return res.status(200).json(response);
        }
    });
});

router.delete("/remove", auth, (req, res) => {
    const {id}  = req.query;
    const uid   = req?.user.uid || '';
    const query = {$and: [{_id : id},{uid : uid}]};
    Products.deleteOne(query, function(err, cat){
        if(err) return res.status(500).json({message: 'Error Occured While Deletion'});
        return res.status(200).json({message: 'Deleted Successfully'});
    });
});

module.exports = router;