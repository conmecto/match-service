import Joi from 'joi';
import { Gender, Country, SearchFor } from './enums';

const paramsUserIdSchema = Joi.object({
    id: Joi.number().required()
});

const topMatchesQuerySchema = Joi.object({
    count: Joi.number().optional().default(10),
    country: Joi.number().valid(...Object.values(Country)).required().default(Country.INDIA)
});

const paramsUserMatchSettingSchema = Joi.object({
    userId: Joi.number().required()
});

const updateUserMatchSettingSchema = Joi.object({
    minSearchAge: Joi.number().optional().min(18).max(69),
    maxSearchAge: Joi.number().optional().max(70).min(19),
    searchFor: Joi.string().valid(...Object.values(SearchFor)).optional(),
    searchIn: Joi.string().optional()
});

export { paramsUserIdSchema, topMatchesQuerySchema, paramsUserMatchSettingSchema, updateUserMatchSettingSchema };