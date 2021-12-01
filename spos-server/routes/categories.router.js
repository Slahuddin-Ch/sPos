const express  = require("express");
const router   = express.Router();
const Category = require('../models/category');
const auth     = require('../middleware/auth');

router.get("/all", auth, async (req, res) => {
    try {
        const uid   = req?.user.uid || '';
        const query = {uid: uid};
        const categories = await Category.find(query).sort( { name: 1 } );
        return res.status(res.statusCode).json(categories)
    } catch (error) {
        return res.status(res.statusCode).json({message : error.message});
    }
});

router.post("/new", auth, async (req, res) => {
    const {name, price, tax} = req.body;
    const uid   = req?.user.uid || '';
    try {
        const findQuery= {$and: [{uid: uid}, {name:name}]}
        const is_exist = await Category.findOne(findQuery);
        if(is_exist===null){
            const category = await Category.create({uid, name, price, tax});
            return res.status(200).json(category)
        }else{
            return res.status(401).json({message : 'Category "'+is_exist.name+'" already exist.'});
        }
    } catch (error) {
        return res.status(401).json({message : error.message});
    }
});

router.put("/update", auth, async (req, res) => {
    const {id, name, price, tax} = req.body;
    if(id==='') res.status(401).json({message: 'Cat ID not found'});
    const uid   = req?.user.uid || '';
    const updateQuery = {$set: {name : name, price:price, tax:tax}};
    const findByQuery = {$and: [{_id: id}, {uid: uid}]};
    Category.updateOne(findByQuery, updateQuery, function(err, data){
        if(err){
            return res.status(500).json({message: 'Error Occured While Updating Category'});
        }
        return res.status(200).json({message: 'Updated Successfully'});
    });
});

router.delete("/remove", auth, (req, res) => {
    const {id}  = req.query;
    const uid   = req?.user.uid || '';
    const query = {$and: [{_id: id}, {uid: uid}]};
    Category.deleteOne(query, function(err, cat){
        if(err) return res.status(500).json({message: 'Error Occured While Deletion'});
        return res.status(200).json({message: 'Deleted Successfully'});
    });
});

module.exports = router;