const Joi = require("joi");
const { joiPassword } = require('joi-password');
Joi.objectId = require("joi-objectid")(Joi);

const schema = Joi.object({
    username: Joi.string().min(4).regex(/^[a-z]+$/).required().messages({
        "any.required": `fields can't be empty`,
        "string.min": "username check failed",
        "string.pattern.base": "username check failed",
    }),
    fname: Joi.string().alphanum().regex(/^[a-zA-z]+$/).required().messages({
        "any.required": `fields can't be empty`,
        "string.min": "fname or lname check failed",
        "string.pattern.base": "fname or lname check failed",
        "string.alphanum": "fname or lname check failed",

    }),
    lname: Joi.string().alphanum().regex(/^[a-zA-z]+$/).required().messages({
        "any.required": `fields can't be empty`,
        "string.min": "fname or lname check failed",
        "string.pattern.base": "fname or lname check failed",
        "string.alphanum": "fname or lname check failed",
    }),

    password: joiPassword
        .string()
        .alphanum()
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required().messages({
            "any.required": `fields can't be empty`,
            "password.minOfUppercase": "password check failed",
            "password.minOfNumeric": "password check failed"
        }),

});

module.exports = schema;