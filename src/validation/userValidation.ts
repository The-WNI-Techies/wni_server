import Joi from "joi";

const userValidationSchema = Joi.object({
    username: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).alphanum().required(),
    role: Joi.string(),
    age: Joi.number(),
    gender: Joi.string(),
    firstName: Joi.string(),
    lastName:  Joi.string(),
    verified: Joi.boolean(),
    

})

export default userValidationSchema;