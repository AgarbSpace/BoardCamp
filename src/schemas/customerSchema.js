import joi from "joi";

const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required(),
    cpf: joi.string().length(11).required(),
    birthday: joi.string().required()
});

export default customerSchema;