import Joi from 'joi';
import { Gender, Country, Search } from './enums';

const paramsUserIdSchema = Joi.object({
    id: Joi.number().required()
});

export { paramsUserIdSchema };