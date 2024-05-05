import Joi from "joi";

const userValidationSchema = Joi.object({
    username: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).alphanum().required()
})

export default userValidationSchema;