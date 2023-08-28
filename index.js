const express = require("express");
//port is an inbuilt programming interaface of class URL withing the url module is used to get and set the port portion of URL
const port = process.env.PORT || 8000;
require('dotenv').config();
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/mongoose");
const session = require("express-session");

//used for session
const passport = require("passport");
const passportLocal = require("./config/passport");
const MongoStore = require("connect-mongo");

// we need to fireup express server to get all the functionality of express usually name is app
const app = express();

app.use(express.static('./assets'));

// set up view engine 
app.set("view engine" , "ejs");
app.set("views" , "./views");

// body parser middleware
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//Cookie Parser Middleware
app.use(cookieParser());

// session middleware or mongo-store is used to store session cookie in database
app.use(
    session({
        name : "placement-cell",
        secret : process.env.SECRET,
        saveUninitialized : false,
        resave : false,
        cookie : {
            maxAge : 1000 * 60 * 100,
        },
        store : MongoStore.create({
            mongoUrl : 'mongodb+srv://adarsh:adarsh@cluster0.xv0ojpp.mongodb.net/PlacementProject?retryWrites=true&w=majority',
            autoRemove : "disabled"
        }),
    })
);

app.use(passport.initialize());
app.use(passport.session());

//set the authenticated user in the response
app.use(passport.setAuthenticatedUser);

// passport middleware
app.use(require("./routes"));


// listen on port or the function is cementically on the port 5500
app.listen(port,(error) => {
    if(error) {
        console.log(`Error in connecting the server ${error}`);
        return;
    }
    console.log(`Server is running success on port :  ${port}`);
}); 