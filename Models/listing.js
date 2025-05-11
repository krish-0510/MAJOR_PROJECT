const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:
    {
        type: String,
        required: true,
    },
    description: String,

    image:
    {
        //  type: String,
        filename: String,
        url: String,
        // set: (v) => v === "" ? "C:\Users\Admin\Downloads\UI_UX.jpeg" : v,

    },
    price: Number,
    location: String,
    country: String
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
