const mongoose = require('mongoose'); 
const initData = require('./data.js');
const Listing = require("../models/Listing.js");

main()
  .then(() =>{
    console.log("connected to DB");
  })
  .catch((err) =>{
    console.log(err);
  })
  
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderers");
}

const initDB = async ()=>{
   await Listing.deleteMany({});
  //  add owner to exisiting db listings , map returns new array
   initData.data = initData.data.map((obj) => ({...obj , owner: '66d94eebcb716d0ebb6816a7'}));
   console.log(initData.data);
   await Listing.insertMany(initData.data);
   console.log("Data was initialised");

}

initDB();