const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./Models/review.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  // res.send("Hi , I am Root");
  res.redirect("/listings");
});

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

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  let errMsg = error.details.map((el) => el.message).join(",");
  if (error) {
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
  console.log(result);
};

//Index Route..
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}); // DB Query
    // res.render("/listings/index.ejs",{allListings});
    res.render("listings/index", { allListings }); // No slash at the start
  })
);

//New Route..
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route..
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
    // let { title, description, image, price, location, country } = req.body; // for abstracting variable
    // let listning=req.body.listing;
  })
);

//Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(req.params);
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if (req.body.listings) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params; // extract the id..
    console.log(req.body);
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //this method passed in updated value..
    res.redirect("/listings");
  })
);

//Delete Route..
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let DeleteListing = await Listing.findByIdAndDelete(id);
    console.log(DeleteListing);
    res.redirect("/listings");
  })
);

// Reviews..
//In Reviews we r creating post route. And we r creating relevant route..
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

// ExpressError

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Vilaa",
//         description: "By the Beach",
//         price: 1200,
//         location: "Calangute , Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful Testing");
// });

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
