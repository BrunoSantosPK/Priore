import { celebrate, Joi, Segments } from "celebrate";

export default celebrate({
    [Segments.BODY]: Joi.object().keys({
        produtos: Joi.array().items(Joi.object({
            formula: Joi.string().required(),
            coeficiente: Joi.number().min(1).required(),
            nome: Joi.string().required()
        })).required(),
        reagentes: Joi.array().items(Joi.object({
            formula: Joi.string().required(),
            coeficiente: Joi.number().min(1).required(),
            nome: Joi.string().required()
        })).required()
    })
});