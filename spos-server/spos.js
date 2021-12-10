const https = require("https");
const http  = require('http');
const fs    = require('fs');
global.active_users = {};
const app   = require("./app");

const server = http.createServer(app).listen(3003);
// Socket Layer over Http Server
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

// On every Client Connection
io.on('connection', (socket) => {
    // On Browser Close/Force-Close/Ethernet Plug Out/Discounnected
    socket.on("disconnect", () => {
        findAndRemove(null, socket.id);
    });
    // On Login
    socket.on("login", (user) => {
        if(user){
            findAndUpdate(user.uid, socket.id);
        }
    });
    // On Logout
    socket.on("logout", (user) => {
        if(user){
            findAndRemove(user.uid, socket.id);
        }
    });
});

function findAndUpdate(uid, sid){
    if(uid && user_exist(uid)){
        active_users[uid].sids.push(sid);
        active_users[uid].count++;
    }else{
        active_users[uid] = {count: 1, sids: [sid]};
    }
}

function findAndRemove(uid, sid){
    if(uid && user_exist(uid)){
        remove(uid, sid);
    }else{
        uid = socket_exist(sid);
        remove(uid, sid);
    }
}

function remove(uid, sid){
    if(uid){
        let index = active_users[uid].sids.indexOf(sid);
        if(index !== -1){
            active_users[uid].sids.splice(index, 1);
            active_users[uid].count--;
        }
    }
}

function user_exist(uid){
    if(active_users[uid]){
        return true;
    }
    return false;
}

function socket_exist(sid){
    let user = null;
    for (const [key, value] of Object.entries(active_users)) {
        if(value.sids.includes(sid)){
            user = key;
        }
    }
    return user;
}