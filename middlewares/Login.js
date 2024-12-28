import Joi from "joi";
import HttpStatusCodes from "../constants/HttpStatusCodes.js";
export function LoginMiddleware(req, res, next) {
    // Define Validation Schema
    const loginSchema = Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }).options({ abortEarly: false });
    // Perform Validation
    const { error } = loginSchema.validate(req.body);
    //Check If Validation succeeded
    if (error) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: error.details.map(detail => detail.message) });
    }
    next();
}
