//Resctructuring listings..

const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// const validateListing = (req, res, next) => {
//   console.log("📦 Incoming Body:", JSON.stringify(req.body, null, 2));
//   let { error } = listingSchema.validate(req.body);
//   let errMsg = error.details.map((el) => el.message).join(",");
//   if (error) {
//     throw new ExpressError(404, errMsg);
//   } else {
//     next();
//   }
//   console.log(result);
// };

//Index Route..
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}); // DB Query
    // res.render("/listings/index.ejs",{allListings});
    res.render("listings/index", { allListings }); // No slash at the start
  })
);

//New Route..
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing Dose not exist!");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing, currUser: req.user });
  })
);

//Create Route..
router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
    // let { title, description, image, price, location, country } = req.body; // for abstracting variable
    // let listning=req.body.listing;
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner, // this should run AFTER isLoggedIn and must be async-safe
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(req.params);
    const listing = await Listing.findById(id);

    //Check if owner property exists and then compare.
    if (!listing) {
      req.flash("error", "Listing you requsted for does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //this method passed in updated value..
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route..
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let DeleteListing = await Listing.findByIdAndDelete(id);
    console.log(DeleteListing);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
