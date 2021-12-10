const express  = require("express");
const router   = express.Router();
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const User     = require('../models/user');
const Products = require('../models/products');
const Category = require('../models/category');
const Sales    = require('../models/sales');
const config   = require('../config/config');
const admin_auth = require('../middleware/adminAuth'); // Login + Admin (Auth)
const auth     = require('../middleware/auth');        // Login (Auth)

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    try {
        // Validate if user exist in our database
        const user = await User.findOne({ username });
        // Validate Passowrd
        if (user && (await bcrypt.compare(password, user.password))) {
            if(active_users[user._id] && active_users[user._id].count >= user.allowed){
                return res.status(401).json({message: 'Account Limit Reached. Max of '+user.allowed+' user(s) can login from same account at same time.'});
            }
            if(user.status==='active'){
                // Create token
                const token = jwt.sign(
                    { uid: user._id, username : user.username, role: user.role},
                    config.SERVER_TOKEN_KEY,
                    { expiresIn: "24h"}
                );
                let response = {
                    uid      : user._id,
                    bname    : user.bname,
                    bntn     : user.bntn,
                    username : user.username,
                    status   : user.status,
                    accounts : user.allowed,
                    token    : token,
                    role     : user.role,
                    receipt_setting : user.receipt_setting
                };
                // return new user
                return res.status(200).json(response);
            }else{
                return res.status(401).json({message: 'Account access blocked. Reason: '+user.status});
            }
        }else{
            return res.status(401).json({message: 'Invalid Credentials'});
        }
    } catch (error) {
        return res.status(401).json({message: error.message});
    }
});

router.post("/register", admin_auth, async (req, res) => {
    const {bname, bntn, email, username, password, role, status, allowed} = req.body;
    try {
        // Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);
        // Register User
        const user = await User.create({
            bname  : bname, 
            bntn   : bntn,
            email  : email,
            role   : role, 
            status : status,
            allowed : allowed,
            username : username,
            password : encryptedPassword,
        });
        // Create token
        const token = jwt.sign(
            { uid: user._id, username },
            config.SERVER_TOKEN_KEY,
            { expiresIn: "2h"}
        );
        // save user token
        user.token = token;
        // return new user
        return res.status(200).json(user);
    } catch (error) {
        if((error?.code && error.code===11000) || error?.errors){
            handleDBError(res, error);
        }else{
            return res.status(401).json({message: error.message});
        }
    }
});

router.post("/update", admin_auth, async (req, res) => {
    const {id, bname, bntn, email, username, role, status, allowed} = req.body;
    try {
        // Update User
        const user = await User.updateOne({_id : id},{
            bname  : bname, 
            bntn   : bntn,
            email  : email,
            role   : role, 
            status : status,
            allowed : allowed,
            username : username,
        });
        console.log(user);
        return res.status(200).json(user);
    } catch (error) {
        if((error?.code && error.code===11000) || error?.errors){
            handleDBError(res, error);
        }else{
            return res.status(401).json({message: error.message});
        }
    }
});

router.put("/receipt-setting-update", auth, async (req, res) => {
    const settings = req.body;
    const uid = req.user.uid;
    try {
        // Update User
        const user = await User.updateOne(
            {_id : uid},
            {receipt_setting  : settings}
        );
        return res.status(200).json(user);
    } catch (error) {
        return res.status(401).json({message: error.message});
    }
});

router.put("/profile-update", auth, async (req, res) => {
    const {bname, bntn} = req.body;
    const uid = req.user.uid;
    try {
        // Update User
        const user = await User.updateOne(
            {_id : uid},
            {bname, bntn}
        );
        return res.status(200).json(user);
    } catch (error) {
        return res.status(401).json({message: error.message});
    }
});

router.post("/password-update", auth, async (req, res) => {
    const {cur_pass, new_pass, cfn_pass} = req.body;
    const uid = req.user.uid;
    try {
        const find = await User.findById(uid);
        if(find && (await bcrypt.compare(cur_pass, find.password))){
            // Encrypt user password
            const encryptedPassword = await bcrypt.hash(new_pass, 10);
            const updtaed = await User.updateOne({_id : uid},{password : encryptedPassword});
            return res.status(200).json(updtaed);
        }else{
            return res.status(401).json({message: 'Invalid Current Password.'});
        }
    } catch (error) {
        return res.status(401).json({message: error.message});
    }
});

router.get("/all", admin_auth, async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (error) {
        return res.status(401).json({message: error.message});
    }
});

router.get("/delete", admin_auth,  async (req, res) => {
    const current_user = req.user;
    const id = req.query.id;
    if(current_user.uid === id){
        return res.status(401).json({message: 'Cannot delete its own account.'});
    }
    try {
        let query = {uid : id};
        const users = await User.findByIdAndDelete(id);
        const cats  = await Products.deleteMany(query);
        const pros  = await Category.deleteMany(query);
        const sales = await Sales.deleteMany(query);
        return res.status(200).json(users);

    } catch (error) {
        return res.status(401).json({message: error.message});
    }
});



function handleDBError(res, error){
    if(error?.code && error.code===11000){
        if(error?.keyValue?.username){
            return res.status(401).json({message: 'Username: '+error?.keyValue?.username+' already registered.'});
        }
        if(error?.keyValue?.email){
            return res.status(401).json({message: 'Email: '+error?.keyValue?.email+' already registered.'});
        }
    }
    else if(error?.errors){
        let message = '';
        for(var e in error.errors){
            if (error.errors.hasOwnProperty(e)) {
                message += error.errors[e].properties.message+"<br>";
            }
        }
        return res.status(401).json({message: message});
    }
}


module.exports = router;