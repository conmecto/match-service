import Joi from 'joi';
import { Gender, Country, Search } from './enums';

const paramsUserIdSchema = Joi.object({
    id: Joi.number().required()
});

const topMatchesQuerySchema = Joi.object({
    count: Joi.number().optional().default(10),
    country: Joi.number().valid(...Object.values(Country)).required().default(Country.INDIA)
});

export { paramsUserIdSchema, topMatchesQuerySchema };