import Joi from 'joi';
import { LocationAccess, SearchFor, SearchArea } from './enums';
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
    searchArea: Joi.string().valid(...Object.values(SearchArea)).optional()
}).min(1);

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

const updateUserLocationSchema = Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
});

const matchSeenSchema = Joi.object({
    matchId: Joi.number().required(),
    userId: Joi.number().required()
});

const genMessageSchema = Joi.object({
    userId: Joi.number().required(),
    context: Joi.string().required()
});

const genMessageResponseSchema = Joi.object({
    userId: Joi.number().required(),
    jobId: Joi.number().required()
})

export { 
    paramsUserIdSchema, paramsUserMatchSettingSchema, updateUserMatchSettingSchema,
    paramsMatchIdSchema, queryParamsUserChatsSchema, endMatchSchema, markChatsReadSchema,
    generateUploadUrlSchema, reportChatSchema, updateUserLocationSchema, matchSeenSchema,
    genMessageSchema, genMessageResponseSchema
};