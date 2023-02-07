const express=require('express');
const router = express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
// .. because we are going out of our folder into another
const Campground=require('../models/campground');
const { Router } = require('express');
const {reviewSchema}=require('../schemaValidate.js')
const Review=require('../models/review')


const ValidateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
     if(error){
        //here error is an object consisting of array of objects
         const msg=error.details.map(el=>el.message).join(',')
         throw new ExpressError(msg,400)
     }
     else{
        next();
     }
}


//ROUTE FOR REVIEW
router.post('/', ValidateReview ,catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    const review= new Review(req.body.review);
    //our ratings & body are under the key 'review'
    //see the form how response is submitted
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Your review has been added');
    res.redirect(`/campgrounds/${campground._id}`);

}))


router.delete('/:reviewId', catchAsync(async (req, res) => {
   const { id, reviewId } = req.params;
   await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   await Review.findByIdAndDelete(reviewId);
   req.flash('success','successfully deleted the review');
   res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;