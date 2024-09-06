const Listing = require('../models/Listing');

module.exports.index = async (req,res) => {
    let allListings = await Listing.find({})
     res.render("listings/index.ejs" , {allListings});
}
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createListing =async(req,res,next) => {
    const newListing = new Listing(req.body.listing);
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = {url , filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success" , "New Listing created");
    res.redirect("/listings");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    // nested populate listing -> reviews ->author
     const listing = await Listing.findById(id)
     .populate({
        path: "reviews" ,
        populate:{
         path: "author"
       }}).populate("owner");
     console.log(listing);
     if(!listing){
        req.flash("error" , "Listing you requested for does not exists!");
        return res.redirect("/listings");
     }
    res.render("listings/show.ejs",{listing});
}

module.exports.renderEditForm = async (req, res ) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};


module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path; 
        let filename = req.file.filename;  
        listing.image = { url, filename }; 
        await listing.save();    
    }
    req.flash("success","Listing Updated!!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    req.flash("success" , "Listing deleted");
    res.redirect("/listings");
}