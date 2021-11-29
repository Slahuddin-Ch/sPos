const mongoose = require("mongoose");
const config = require('./config');

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database Connected");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};



/*
1) Start MongoDB without access control.
mongod --port 27017 --dbpath /data/db

2) Connect to the instance.
mongo --port 27017

3) Create the user administrator (in the admin authentication database).
 db.createUser(
   {
     user: "mongo-admin",
     pwd: "mongo-admin-pass",
     roles: [
        { role: "userAdminAnyDatabase", db: "admin" }
     ]
   }
 )

4) Re-start the MongoDB instance with access control.
mongod --auth --port 27017 --dbpath /data/db

5) Connect and authenticate as the user administrator.
mongo --port 27017 -u "mongo-admin" -p "mongo-admin-pass" --authenticationDatabase "admin"

6) Create additional users as needed for your deployment (e.g. in the test authentication database).
db.createUser(
   {
     user: "wattax-admin",
     pwd: "wattax-admin-pass",
     roles: [
        { role: "readWrite", db: "wattax" }
     ]
   }
 )
mongo --port 27017 -u "wattax-admin" -p "wattax-admin-pass" --authenticationDatabase "test"



mongodb://127.0.0.1:27017/?authSource=admin&compressors=disabled&gssapiServiceName=mongodb


mongodb://mongo-admin:mongo-admin-pass@localhost:27017/wattax?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
*/

