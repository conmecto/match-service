import { redisClient1 } from '../config';
import { enums } from '../utils';
import logger from './logger';

const setKey = async (key: string, value: string): Promise<boolean | null> => {
    let res: string | null = null;
    try {
        if (redisClient1.isReady) {
            res = await redisClient1.set(key.toLocaleLowerCase(), value);
        } 
    } catch(error: any) {
        const errorString = JSON.stringify({
            stack: error?.stack,
            message: error?.toString()
        });
        await logger(enums.PrefixesForLogs.REDIS_SET_OBJECT + errorString);
    }
    return Boolean(res);
}

const getKey = async (key: string): Promise<string | null> => {
    let value: string | null = null;
    try {
        if (redisClient1.isReady) {
            value = await redisClient1.get(key);
        }
    } catch(error: any) {
        const errorString = JSON.stringify({
            stack: error?.stack,
            message: error?.toString()
        });
        await logger(enums.PrefixesForLogs.REDIS_GET_OBJECT + errorString);
    }
    return value;
}

export { setKey, getKey }

