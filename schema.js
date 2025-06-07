const Joi = require("joi");
const Listing = require("./Models/listing");
const review = require("./Models/review");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().uri().optional(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});


let { id } = req.params; // extract the id..
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
         req.flash("err","You Don't have permission to edit");
         res.redirect(`/listings/${id}`)
    }
