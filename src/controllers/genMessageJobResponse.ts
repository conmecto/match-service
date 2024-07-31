import { validationSchema, enums, interfaces } from '../utils';
import { CustomError } from '../services';
import { redisClient1 } from '../config';

const genMessageJobResponse = async (req: interfaces.IRequestObject) => {
    const userId = Number(req.params.userId);
    const jobId = Number(req.params.jobId);
    await validationSchema.genMessageResponseSchema.validateAsync({ userId, jobId });
    const response = await redisClient1.hGetAll('bull:genTextQueue:' + jobId);
    if (!response?.returnvalue) {
        throw new CustomError(enums.StatusCodes.NOT_FOUND, enums.Errors.JOB_NOT_FOUND, enums.ErrorCodes.JOB_NOT_FOUND);
    }
    return JSON.parse(response.returnvalue);
}

export default genMessageJobResponse;