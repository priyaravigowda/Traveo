const Review = require('../models/review.js');
const Listing = require('../models/Listing.js');

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author = req.user._id;
    await newReview.save();
    await listing.save();
    console.log("new reviews added");
    req.flash("success" , "New review created");
    res.redirect(`/listings/${req.params.id}`)
}

module.exports.destroyReview = async(req,res)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review deleted");
    res.redirect(`/listings/${id}`);
}