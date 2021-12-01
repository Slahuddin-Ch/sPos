const express  = require("express");
const router   = express.Router();
const Sales    = require('../models/sales');
const auth     = require('../middleware/auth');

router.post("/all", auth, async (req, res) => {
    try {
        const uid   = req?.user.uid || '';
        const { to, from, method } = req.body;
        let fQuery = {uid: uid};
        if(method && method!==''){
            fQuery = {$and : [{uid: uid}, {method: method}]};
        }
        if(from && from!==''){
            let fromQuery = {created_date: {$gt: from}};
            if(fQuery.$and){
                fQuery.$and.push(fromQuery);
            }else{
                fQuery = {$and : [{uid: uid}, fromQuery]};
            }
        }
        if(to && to!==''){
            let toQuery = {created_date: {$lt: to}};
            if(fQuery.$and && fQuery.$and[fQuery.$and.length-1]){
                fQuery.$and[fQuery.$and.length-1].created_date['$lt'] = to;
            }
            else if(fQuery.$and){
                fQuery.$and.push(toQuery);
            }
            else{
                fQuery = {$and : [{uid: uid}, toQuery]};
            }
        }
        console.log(fQuery.$and);
        const sales = await Sales.find(fQuery).sort( { created_date: 1 } );
        return res.status(res.statusCode).json(sales)
    } catch (error) {
        return res.status(res.statusCode).json({message : error.message});
    }
});

router.post("/add", auth, async (req, res) => {
    const uid   = req?.user.uid || '';
    const { total, discount, method, items, subtotal, paid } = req.body;
    try {
        const sale = await Sales.create({ uid, total, discount, method, items, subtotal, paid });
        console.log(sale);
        return res.status(200).json(sale);
    } catch (error) {
        return res.status(401).json({message : error.message});
    }
});

module.exports = router;