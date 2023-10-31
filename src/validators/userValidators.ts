import Joi from "joi";

export const regUserSchema = Joi.object({
    FullName: Joi.string().required().min(3).max(30),
    email : Joi.string().email({
        minDomainSegments:2, tlds:{
            allow: ['com', 'ke']
        }
    }),
    phone_no: Joi.string().min(10).max(20).required(),
    profession: Joi.string().required(),
    password: Joi.string().required().pattern(
        new RegExp('^[a-zA-Z0-9!@#$%^&*()]{3,30}$')
    )
})
