// require the library
const mongoose = require("mongoose");

// connecting to the database
mongoose.connect(process.env.MONGURL);

// accquiring the connection to check if it is successful
const db = mongoose.connection;

//checking for the error
db.once("error",console.error.bind(console , "error in connecting the database"));

//up and running then print the statement
db.once("open" , () => {
    console.log("successfully connected to the database");
});

// exporting the connection 
module.exports = db;