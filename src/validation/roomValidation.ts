import Joi from "joi";

const roomValidationSchema = Joi.object({
    creator: Joi.required(),
    hosts: Joi.required(),
    name: Joi.string().required().min(2),
    description: Joi.string().min(5).max(50),
    participants: Joi.array(),
    messages: Joi.array(),
    join_link: Joi.string()
})

export default roomValidationSchema;