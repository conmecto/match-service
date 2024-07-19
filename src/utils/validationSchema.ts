import Joi from 'joi';
import { Gender, Country, SearchFor } from './enums';
import { ALLOWED_IMAGE_TYPES } from './constants';

const paramsUserIdSchema = Joi.object({
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
    skip: Joi.number().required(),
    userId: Joi.number().required(),
    page: Joi.number().required().min(1),
    perPage: Joi.number().required().min(1).max(10),
});

const endMatchSchema = Joi.object({
    matchId: Joi.number().required(),
    userId: Joi.number().required(),
    block: Joi.boolean().required()
});

const markChatsReadSchema = Joi.object({
    matchId: Joi.number().required(),
    userId: Joi.number().required(),
});

const generateUploadUrlSchema = Joi.object({
    matchId: Joi.number().required(),
    userId: Joi.number().required(),
    fileName: Joi.string().required(),
    contentType: Joi.string().valid(...ALLOWED_IMAGE_TYPES).required()
});

const reportChatSchema = Joi.object({
    matchId: Joi.number().required(),
    userId: Joi.number().required(),
    chatId: Joi.number().required()
});

export { 
    paramsUserIdSchema, paramsUserMatchSettingSchema, updateUserMatchSettingSchema,
    paramsMatchIdSchema, queryParamsUserChatsSchema, endMatchSchema, markChatsReadSchema,
    generateUploadUrlSchema, reportChatSchema
};