const mongoose=require('mongoose');
const review = require('./review');
const Schema=mongoose.Schema;
// const user=require('./user');

const CampgroundSchema=new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});
//a Schema Object

//using mongoose middleware to delete all reviews for a particular campground when that campground is deleted
//ensure the right express helper is triggering the mongoose middleware
CampgroundSchema.post('findOneAndDelete',async function(doc){
    //where doc is the document that we just deleted
    if(doc){
        await review.deleteMany({
            _id:{
                $in: doc.reviews
                //where for every id if it is present it doc.reviews it will be deleted
            }
        })
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema);
//export CampgroundSchema from this file
//.model makes a copy of Schema