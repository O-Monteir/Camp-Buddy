//same as index.js
const mongoose = require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities');
// const {places,descriptors}=require('./seedHelpers');
const {descriptors,places} = require('./seedHelpers');
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

const sample=(array)=> array[Math.floor(Math.random() * array.length)];


const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++)
    {
        const random1000 = Math.floor(Math.random()*1000);
        const price =Math.floor(Math.random()*20)+10;
        
        const camp = new Campground({
            author:'63e1dfa4639344f265c70d2d',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            // image:'https://source.unsplash.com/collection/483251',
            // image:'https://random.imagecdn.app/500/150',
            image:'https://api.unsplash.com/photos/random/woods',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            price
        })

        await camp.save();

            
    }
}

// async function seedImg() {
//     try {
//       const resp = await axios.get('https://api.unsplash.com/photos/random', {
//         params: {
//           client_id: '****YOUR CLIENT ID GOES HERE****',
//           collections: 1114848,
//         },
//       })
//       return resp.data.urls.small
//     } catch (err) {
//       console.error(err)
//     }
//   }

seedDB().then(()=>{
    mongoose.connection.close();
});

// seeds/index.js