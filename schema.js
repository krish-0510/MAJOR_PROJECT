const Joi = require('joi');
const Listing = require('./Models/listing');

module.exports.listingSchema = Joi.object({
     listing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        country: Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null)
     }).required()
});