const express=require('express');
const router = express.Router();
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
// .. because we are going out of our folder into another
const Campground=require('../models/campground');
const { Router } = require('express');
const {campgroundSchema}=require('../schemaValidate.js');
const {isLoggedIn}=require('../middleware');
const ValidateCampground = (req,res,next)=>{
    
    const {error}=campgroundSchema.validate(req.body);
    if(error){
       //here error is an object consisting of array of objects
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
       next();
    }
}


//a route to an index displaying all  name
router.get('/',catchAsync(async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}));



router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new')
})

//CREATING NEW CAMPGROUND

//when the form is submitted via POST request
router.post('/',isLoggedIn,ValidateCampground, catchAsync(async(req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    //this is when someoen tries to post a request using postman, prevents empty fields
    //we throw new error inside catchAsync and catchAsync catches it and calls next()
    const campground = new Campground(req.body.campground);
    //USER IS LOGGED IN, IF USER CREATES CAMP, ADD USER AS AUTHOR
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','Successfully made a new campground');
    res.redirect(`campgrounds/${campground._id}`)
}))

//our shor template
//route to display individual camps
router.get('/:id',catchAsync(async(req,res)=>{
    
    const campground =await Campground.findById(req.params.id).populate('reviews').populate('author');
    //POPULATING IS DONE TO ENSURE THAT CAMOGROUND NOW HAS ACCESS TO ALL THE AUTHORS 
    console.log(campground)
    if(!campground){
        req.flash('error',"We can't find what you are looking for!");
        return res.redirect('/campgrounds');
        //if no campground then redirect
    }
    res.render('campgrounds/show',{campground});
    //passing {} data to view
}))

//route to edit a camp
router.get('/:id/edit',isLoggedIn,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground =await Campground.findById(id)
    if(!campground){
        req.flash('error',"We can't find what you are looking for!");
        return res.redirect('/campgrounds');
        //if no campground then redirect
    }
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
        //find campgroun and before update checks if u have the authorization to update it
        
    }

    res.render('campgrounds/edit',{campground});
    //passing {} data to view
}))

router.put('/:id',isLoggedIn,ValidateCampground,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
        //find campgroun and before update checks if u have the authorization to update it
        
    }
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Successfully updated campgrounds!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const{id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','successfully deleted campground');
    res.redirect('/campgrounds');

}))

module.exports=router;
