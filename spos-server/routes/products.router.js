const express  = require("express");
const router   = express.Router();
const Products = require('../models/products');
const auth     = require('../middleware/auth');

router.get("/all", auth, async (req, res) => {
    try {
        const uid   = req?.user.uid || '';
        const query = {uid: uid};
        const products = await Products.find(query).sort( { name: 1 } );
        return res.status(res.statusCode).json(products)
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
            return res.status(res.statusCode).json(product)
        }else{
            return res.status(401).json({message: 'Product not found'});
        }
        
    } catch (error) {
        return res.status(res.statusCode).json({message : error.message});
    }
});

router.post("/new", auth, async (req, res) => {
    const {name, code, price, tax} = req.body;
    const uid   = req?.user.uid || '';
    try {
        const product = await Products.create({uid, name, code, price, tax});
        return res.status(res.statusCode).json(product)
    } catch (error) {
        if(error.code===11000)
            return res.status(401).json({message : 'Product "'+name+'" already exist.'});
        else
            return res.status(401).json({message : error.message});
    }
});

router.put("/update", auth, async (req, res) => {
    const {id, name, code, price, tax} = req.body;
    if(id==='') res.status(401).json({message: 'Product ID not found'});
    const uid   = req?.user.uid || '';
    const query = {$set: {name : name, code : code, price:price, tax:tax}};
    const findQuery = {$and: [{_id : id},{uid : uid}]};
    Products.updateOne(findQuery, query, function(err, data){
        if(err){
            return res.status(500).json({message: 'Error Occured While Updating Product'});
        }
        return res.status(200).json({message: 'Updated Successfully'});
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