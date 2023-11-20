import Joi from 'joi';
import { Gender, Country, SearchFor } from './enums';

const paramsUserIdSchema = Joi.object({
    id: Joi.number().required()
});

const topMatchesQuerySchema = Joi.object({
    count: Joi.number().optional().default(10),
    country: Joi.number().valid(...Object.values(Country)).required().default(Country.INDIA)
});

const pastMatchesQuerySchema = Joi.object({
    count: Joi.number().optional().default(10),
    userId: Joi.number().required()
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

const paramsMatchIdSchema = Joi.object({
    matchId: Joi.number().required()
});

const queryParamsUserChatsSchema = Joi.object({
    userId: Joi.number().required(),
    page: Joi.number().required().min(1),
    perPage: Joi.number().required().min(20).max(20),
});

const endMatchSchema = Joi.object({
    matchId: Joi.number().required(),
    userId: Joi.number().required(),
});

export { 
    paramsUserIdSchema, topMatchesQuerySchema, paramsUserMatchSettingSchema, updateUserMatchSettingSchema,
    pastMatchesQuerySchema, paramsMatchIdSchema, queryParamsUserChatsSchema, endMatchSchema
};