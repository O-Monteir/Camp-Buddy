//same as index.js
const express=require('express');
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate');
const {campgroundSchema,reviewSchema}=require('./schemaValidate.js')

const ExpressError=require('./utils/ExpressError')
const catchAsync=require('./utils/catchAsync');
const Review=require('./models/review')
const app=express();
const path=require('path')
const methodOverride = require('method-override');
const Campground=require('./models/campground');
const Joi = require('joi');

//ROUTES
const campgroundsRoutes =require('./routes/campgrounds')
const reviewsRoutes=require('./routes/reviews');
const usersRoutes=require('./routes/users');

const session=require('express-session');
const flash=require('connect-flash');

const passport =require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

mongoose.set('strictQuery', true);


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    //pass in our options
    useNewUrlParser:true,
    useUnifiedTopology:true
});


const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected");
});

//CONFIGURATION FOR APP
app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))

app.use(express.urlencoded({extended:true}))
//to parse post method data
app.use(methodOverride('_method'));
//where _method is our query string


//routes to create a new campground
//just a form, no need for async

app.use(express.static(path.join(__dirname,'public')))
const sessionConfig={
    secret:'thishsouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now(),
        maxAge:Date.now()
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//session so we don't have to login on every request
//note passport.session should be below sessionConfig

passport.use(new LocalStrategy(User.authenticate()));
//our authenticate is located on User model. our model doesnt have it, but docs do

passport.serializeUser(User.serializeUser());
//how to store user in session
passport.deserializeUser(User.deserializeUser());
//how to unstore user data from session






app.use((req,res,next)=>{
    //print entire session to see whats going on
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
    //middleware should have next(). if not then we dont make it to route and error handlers, its broken
})
//on every single req we will have the flash message that will be available to us in locals variable in 'success'
//before any of our campground routes
//creating a middleware to handle flash in app.js

//ONE TIME ACCESS FOR CHECKING 
// app.get('/fakeUser',async(req,res)=>{
//     const user = new User({email:'olteen@gmail.com',username:'colt12'});
//     const newUser = await User.register(user,'chicken');
//     res.send(newUser);
//     //take instance of model and passes password
// })

app.use('/',usersRoutes);
app.use('/campgrounds',campgroundsRoutes)
app.use('/campgrounds/:id/reviews',reviewsRoutes)


 
app.get('/',(req,res)=>{
    res.render('home')
})


//a handler that throws an error if a url we dont recognize is posted
app.all('*',(req,res,next)=>{
    //where all is for all request
    //* is for every 'path'
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='Oh no, Gadbad'
    res.status(statusCode).render('error',{err});
})


app.listen(3000, ()=>{
    console.log('CONNECTED TO PORT 3000')
})