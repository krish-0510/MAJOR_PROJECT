const express = require("express");
const router = express.Router({ mergeParams: true }); // To merge the Parent and child..route.. for using another file
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isOwner ,
  isReviewAuthor,
} = require("../middleware.js");

// Post Reviews..
//In Reviews we r creating post route. And we r creating relevant route..
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    // console.log(req.params.id);  To check the Value is Define or not..
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    return res.redirect(`/listings/${listing._id}`);
  })
);

//Delete  review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isOwner ,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
