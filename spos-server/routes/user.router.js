const express  = require("express");
const router   = express.Router();
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const User     = require('../models/user');

const SERVER_TOKEN_KEY = '12345678%#@)&fr';

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    try {
        // Validate if user exist in our database
        const user = await User.findOne({ username });
        // Validate Passowrd
        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { uid: user._id, username},
                SERVER_TOKEN_KEY,
                { expiresIn: "24h"}
            );
            let temp = {
                uid      : user._id,
                username : user.username,
                token    : token
            };
            // return new user
            return res.status(200).json(temp);
        }else{
            return res.status(401).json({message: 'Invalid Credentials'});
        }
    } catch (error) {
        return res.status(401).json({message: error.message});
    }
});

router.post("/register", async (req, res) => {
    const {username, password} = req.body;
    try {
        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
        // Register User
        const user = await User.create({
            username : username, 
            password : encryptedPassword
        });
        // Create token
        const token = jwt.sign(
            { uid: user._id, username },
            SERVER_TOKEN_KEY,
            { expiresIn: "2h"}
        );
        // save user token
        user.token = token;
        // return new user
        return res.status(200).json(user);
    } catch (error) {
        return res.status(401).json({message: error.message});
    }
});

module.exports = router;