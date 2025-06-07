const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    //  type: String,
    filename: String,
    url: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-YpcljRcc3INWkmo95j9nb8h3rbgFjSY3AQ&s",
    },
    // set: (v) => v === "" ? "C:\Users\Admin\Downloads\UI_UX.jpeg" : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
     type: Schema.Types.ObjectId,
     ref:"User",
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
  await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
