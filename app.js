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

//Index Route..
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({}); // DB Query
  // res.render("/listings/index.ejs",{allListings});
  res.render("listings/index", { allListings }); // No slash at the start
});

//New Route..
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

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
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  // console.log(req.params);
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params; // extract the id..
  console.log(req.body);
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //this method passed in updated value..
  res.redirect("/listings");
});

//Delete Route..
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let DeleteListing = await Listing.findByIdAndDelete(id);
  console.log(DeleteListing);
  res.redirect("/listings");
});

// ExpressError

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  // res.render("error.ejs");
  res.status(statusCode).send(message);
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
