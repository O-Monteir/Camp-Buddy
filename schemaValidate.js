const Joi=require('joi');
//using JOI to add validations to schema
 //this is not our mongoose schema, this is where we validate the data BEFORE it goes into the SCHEMA
module.exports.campgroundSchema=Joi.object({
    //everything under campground body as price and all are also under campground 
     campground:Joi.object({
         //specifies type
         title:Joi.string().required(),
         price:Joi.number().required().min(0),
         image:Joi.string().required(),
         location:Joi.string().required(),
         description:Joi.string().required()
     }).required()
 });

 module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        //where review is the object as seen in db
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
 })