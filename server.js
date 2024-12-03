
const dotenv= require('dotenv');
dotenv.config();
const express = require("express");
const app= express();
const session = require("express-session");
const passUserToView = require("./middleware/path-user-to-view");

const mongoose = require("mongoose");
const methodOverride=require("method-override");
const morgan = require("morgan");

//port configuration
const port = process.env.port? process.env.port: "3000";

//db connection
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", ()=>
{
    console.log("Connected to MongoDB: ", mongoose.connection.name);
});

//middleware
app.use(express.urlencoded({extended:false}));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: true
}))

app.use(passUserToView);

//Require controllers
const authCtrl = require("./controllers/auth");
const isSignedIn = require('./middleware/is-signed-in');

app.use("/auth", authCtrl);

//port route
app.get('/', async (req,res)=>
{
    res.render("index.ejs");
})

//route for testing
//vip lounge
app.get("/vip-lounge", isSignedIn,(req,res)=>
{
    res.send("Welcome to the party "+req.session.user.username);
})
app.listen(port, ()=>
{
    console.log("Listening on port:", port);
})