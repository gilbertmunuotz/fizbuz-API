import Joi from "joi";
import HttpStatusCodes from "../constants/HttpStatusCodes.js";
export function RegistrationMiddleware(req, res, next) {
    // Define Validation Schema
    const registrationSchema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().pattern(new RegExp(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/i)).required(),
        password: Joi.string().required(),
    }).options({ abortEarly: false });
    // Perform Validation
    const { error } = registrationSchema.validate(req.body);
    //Check If Validation succeeded
    if (error) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: error.details.map(detail => detail.message) });
    }
    next();
}
