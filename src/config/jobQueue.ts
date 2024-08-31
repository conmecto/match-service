import { Queue } from 'bullmq';
import { Environments, constants } from '../utils';

const options = constants.TEXT_GEN_JOB_QUEUE;

const genTextQueue = new Queue('genTextQueue', { 
    defaultJobOptions: { 
        delay: options.DELAY_MS,
        attempts: options.ATTEMPTS,
        stackTraceLimit: options.STACK_TRACE_LIMIT,
        removeOnComplete: {
            age: options.REMOVE_ON_AGE_SEC,
            count: options.REMOVE_ON_COUNT,
        },
        removeOnFail: {
            age: options.REMOVE_ON_AGE_SEC,
            count: options.REMOVE_ON_COUNT
        },
    }, 
    connection: {
        host: Environments.redis.host,
        port: Environments.redis.port,
        username: Environments.redis.username,
        password: Environments.redis.password
    }
});

const updateDobQueue = new Queue('updateDobQueue', { 
    defaultJobOptions: { 
        removeOnComplete: {
            age: options.REMOVE_ON_AGE_SEC,
            count: options.REMOVE_ON_COUNT,
        },
        removeOnFail: {
            age: options.REMOVE_ON_AGE_SEC,
            count: options.REMOVE_ON_COUNT
        },
    }, 
    connection: {
        host: Environments.redis.host,
        port: Environments.redis.port,
        username: Environments.redis.username,
        password: Environments.redis.password
    }
});

export {
    genTextQueue,
    updateDobQueue
}