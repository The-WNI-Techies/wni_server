import Joi from "joi";

const roomValidationSchema = Joi.object({
    creator: Joi.required(),
    name: Joi.string().required().min(2),
    description: Joi.string().min(5),
    participants: Joi.array(),
    messages: Joi.array(),
    mode: Joi.string(),
    join_id: Joi.string()
})

export default roomValidationSchema;