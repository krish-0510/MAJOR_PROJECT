//Resctructuring listings..

const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../Models/listing.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  let errMsg = error.details.map((el) => el.message).join(",");
  if (error) {
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
  console.log(result);
};

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
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","Listing Dose not exist!");
      return res.redirect("/listings");
    }
  res.render("listings/show", { listing });
  })
);

//Create Route..
router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    // let { title, description, image, price, location, country } = req.body; // for abstracting variable
    // let listning=req.body.listing;
  })
);

//Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(req.params);
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    if (req.body.listings) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params; // extract the id..
    console.log(req.body);
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //this method passed in updated value..
     req.flash("success","Listing Updated!");
    res.redirect("/listings");
  })
);



//Delete Route..
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let DeleteListing = await Listing.findByIdAndDelete(id);
    console.log(DeleteListing);
     req.flash("success"," Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
