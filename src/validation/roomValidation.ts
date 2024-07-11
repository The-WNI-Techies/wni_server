import Joi from "joi";

const roomValidationSchema = Joi.object({
    creator: Joi.required(),
    hosts: Joi.required(),
    name: Joi.string().required(),
    description: Joi.string(),
    participants: Joi.array(),
    messages: Joi.array()
})

export default roomValidationSchema;