const express  = require("express");
const router   = express.Router();
const Products = require('../models/products');
const Category = require('../models/category');
const auth     = require('../middleware/auth');

router.get("/all", auth, async (req, res) => {
    try {
        const uid   = req?.user.uid || '';
        const products = await Products.aggregate([
            { $match: { uid: uid } },
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

router.post("/import", auth, async (req, res) => {
    const products = req.body;
    const uid   = req?.user.uid || '';
    if(typeof products === 'object' && products.length>0){
        // name, price, barcode, category, tax
        let success = 0;
        let exist = 0;
        try {
            const forLoop = async _ => {
                for (let index = 0; index < products.length; index++) {
                    const item = products[index];
                    let category = {uid: uid, name: item[3], tax: item[4]};
                    let product  = {uid: uid, cat_id: '', name: item[0], code: item[2], price: item[1]};
                    // FIND CATEGORY
                    let cquery = {$and: [{uid: uid}, {name: category.name}]};
                    var c = await Category.findOne(cquery);
                    if(c){}
                    else{
                        c = await Category.create(category);
                    }
                    let pquery = {$and: [{code : product.code}, {uid : uid}]};
                    const p = await Products.findOne(pquery); 
                    if(p){
                        exist++;
                    }else{
                        success++;
                        product.cat_id = await c._id;
                        await Products.create(product);
                    }
                }
                return res.status(200).json({success : success, exist: exist});
            }
            forLoop();
        } catch (error) {
            return res.status(401).json(error.message);
        }
    }else{
        return res.status(401).json('Invalid Data Sent. NOT VALID DATA')
    }
});

async function findCategory(category, uid, callback){
    try {
        let query = {$and: [{uid: uid}, {name: category.name}]};
        var cat = await Category.findOne(query);
        if(cat){
            callback(null, cat);
        }else{
            callback(null, null);
        }
    } catch (error) {
        callback(error, null);
    }
}

module.exports = router;