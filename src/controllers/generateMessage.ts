import { Worker, Job } from 'bullmq';
import { validationSchema, enums, Environments, interfaces } from '../utils';
import { genTextQueue } from '../config';
import { 
    CustomError, generateFromTextInput, addTextGenResponse, checkTextGenerateLimit, 
    logger 
} from '../services';

const generateMessage = async (req: interfaces.IRequestObject) => {
    const userId = Number(req.params.userId);
    const context = req.query.context as string;
    await validationSchema.genMessageSchema.validateAsync({ userId, context });
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const check = await checkTextGenerateLimit(userId);
    if (!check) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const job = await genTextQueue.add('genText', {
        context,
        userId
    });
    if (!job.id) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    return {
        jobId: job.id
    }
}

const processGenMessage = async (userId: number, context: string) => {
    const output = await generateFromTextInput(context);
    if (!output) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    await addTextGenResponse({ userId, context, ...output });
    return {
        response: output.response
    }
}

const genTextWorker = new Worker('genTextQueue', async (job: Job) => {
    const { userId, context } = job.data;
    const res = await processGenMessage(userId, context);
    return res;
}, {
    connection: {
        host: Environments.redis.host,
        port: Environments.redis.port,
        username: Environments.redis.username,
        password: Environments.redis.password
    }
});

genTextWorker.on('failed', (job: Job | undefined, error: Error) => {
    const failedError = JSON.stringify({
        message: error?.message,
        stack: error?.stack 
    });
    logger('Process Gen Text Worker Failed: ' + failedError);
});

genTextWorker.on('error', err => {
    const error = JSON.stringify({
        message: err?.message,
        stack: err?.stack 
    });
    logger('Process Gen Text Worker Error: ' + error);
});

export { generateMessage, genTextWorker };