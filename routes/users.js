const express=require('express');
const router =express.Router();
const User = require('../models/user');
const catchAsync=require('../utils/catchAsync');
const passport =require('passport');
const LocalStrategy = require('passport-local');

router.get('/register',(req,res)=>{
    res.render('users/register');
});

router.post('/register',catchAsync(async(req,res)=>{
    try{
        const {email,username,password}=req.body;
        const user = new User({email, username});
        const registeredUser=await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success','Welcome to Camp Buddy!');
            res.redirect('/campgrounds');
        })
        //req.login is from passport, allows us to login a user who has jsut registered, doesn not support async
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
    
}));

//SERVING A FORM
router.get('/login',(req,res)=>{
    res.render('users/login');
})

//TAKING LOGIN REQUEST
//passport offers functionality
//specify strategy i.e local, we can authenticate using google as well
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),(req,res)=>{
    req.flash('success','welcome back!');
    //to check what returnTo contains
    const redirectUrl=req.session.returnTo || '/campgrounds';
    //redirect to prev path of user or just to campgrounds if returnTo is empty
    //delete the returnTo obj because we dont want it to just sit in the session
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})



router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      // if you're using express-flash
      
      req.flash('success',"Goodbye!");
      res.redirect('/campgrounds');
    });
  });
  


module.exports = router;