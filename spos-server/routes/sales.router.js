const express  = require("express");
const router   = express.Router();
const Sales    = require('../models/sales');
const auth     = require('../middleware/auth');
const admin_auth = require('../middleware/adminAuth');

router.post("/all", auth, async (req, res) => {
    try {
        const uid    = req?.user.uid || '';
        const from   = (req.body?.from && req.body.from!=='') ? new Date(req.body.from) :  null;
        const to     = (req.body?.to && req.body.to!=='') ? new Date(req.body.to) :  null;
        const method = req.body.method;
        if(to){
            to.setHours(23);
            to.setMinutes(59);
            to.setSeconds(59);
        }
        let fQuery = {uid: uid};
        if(method && method!==''){
            fQuery = {$and : [{uid: uid}, {method: method}]};
        }
        if(from && from!==''){
            let fromQuery = {created_date: {$gte: from.toISOString()}};
            if(fQuery.$and){
                fQuery.$and.push(fromQuery);
            }else{
                fQuery = {$and : [{uid: uid}, fromQuery]};
            }
        }
        if(to && to!==''){
            let toQuery = {created_date: {$lte: to.toISOString()}};
            if(fQuery.$and && fQuery.$and[fQuery.$and.length-1]){
                fQuery.$and[fQuery.$and.length-1].created_date['$lte'] = to.toISOString();
            }
            else if(fQuery.$and){
                fQuery.$and.push(toQuery);
            }
            else{
                fQuery = {$and : [{uid: uid}, toQuery]};
            }
        }
        const sales = await Sales.find(fQuery).sort( { created_date: -1 } );
        return res.status(res.statusCode).json(sales)
    } catch (error) {
        return res.status(res.statusCode).json({message : error.message});
    }
});

router.post("/add", auth, async (req, res) => {
    const uid   = req?.user.uid || '';
    const { total, discount, method, items, subtotal, paid, paid_in } = req.body;
    const created_date  = new Date(Date.now()).toISOString();
    try {
        const sale = await Sales.create({ uid, total, discount, method, items, subtotal, paid, paid_in, created_date });
        return res.status(200).json(sale);
    } catch (error) {
        return res.status(401).json({message : error.message});
    }
});

router.post("/total", admin_auth, async (req, res) => {
    try {
        const uid    = req.body?.bid || '';
        const from   = (req.body?.from && req.body.from!=='') ? new Date(req.body.from) :  null;
        const to     = (req.body?.to && req.body.to!=='') ? new Date(req.body.to) :  null;
        if(to){
            to.setHours(23);
            to.setMinutes(59);
            to.setSeconds(59);
        }
        let fQuery = {uid: uid};
        if(from && from!==''){
            let fromQuery = {created_date: {$gte: from.toISOString()}};
            fQuery = {$and : [{uid: uid}, fromQuery]};
        }
        if(to && to!==''){
            let toQuery = {created_date: {$lte: to.toISOString()}};
            if(fQuery.$and && fQuery.$and[fQuery.$and.length-1]){
                fQuery.$and[fQuery.$and.length-1].created_date['$lte'] = to.toISOString();
            }
            else if(fQuery.$and){
                fQuery.$and.push(toQuery);
            }
            else{
                fQuery = {$and : [{uid: uid}, toQuery]};
            }
        }
        const sales = await Sales.find(fQuery).sort( { created_date: -1 } );
        return res.status(res.statusCode).json(sales)
    } catch (error) {
        return res.status(res.statusCode).json({message : error.message});
    }
});

router.post("/delete", admin_auth, async (req, res) => {
    try {
        const ids    = req.body.ids;
        const query = { _id: { $in: ids } };
        const sales = await Sales.deleteMany(query);
        return res.status(200).json(sales)
    } catch (error) {
        return res.status(401).json({message : error.message});
    }
});

router.post("/delete-by-cat", admin_auth, async (req, res) => {
    try {
        const sale_ids    = req.body.sale_ids;
        const cat_id      = req.body.cat_id;
        const prices      = req.body.prices;

        const query = { _id: { $in: sale_ids } };
        var sales   = await Sales.find(query);
        if(sales.length>0){
            sales.every(async (sale, i) => {
                var items = JSON.parse(sale.items);
                for (let index = 0; index < items.length; index++) {
                    var item = items[index];
                    if(cat_id===item.cat_id && prices.includes(item.price)){
                        sales[i].subtotal = parseFloat(sales[i].subtotal) - parseFloat(item.price);
                        let disc = parseInt(sales[i].discount)/100;
                        sales[i].total = (sales[i].subtotal - (sales[i].subtotal * disc))
                        delete items[index];
                    }
                }
                sales[i].items = JSON.stringify(items);
                const query = {$set: sales[i]};
                const findQuery = {_id : sales[i]._id};
                await Sales.findOneAndUpdate(findQuery, query);
                return true;
            });
        }
        //const sales = await Sales.deleteMany(query);
        return res.status(200).json(true)
    } catch (error) {
        return res.status(401).json({message : error.message});
    }
});

module.exports = router;