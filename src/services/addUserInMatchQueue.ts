import { redisClient1 as cacheClient } from '../config';
import { Environments, enums } from '../utils';
import updateUserCurrentQueue from './updateUserCurrentQueue';

const getMinSizeQueueIndex = async () => {
    let queueIndex = 1;
    const queueName = Environments.redis.matchQueue;
    let min = await cacheClient.lLen(queueName + '1');
    for(let i = 2; i <= Environments.redis.maxNumberOfMatchQueue; i++) {
    const tempSize = await cacheClient.lLen(queueName + '1');
    if (tempSize < min) {
        min = tempSize;
        queueIndex = i;
    }
    }
    return queueIndex;
}

const addUserInMatchQueue = async (userId: number) => {
    try {
        const minSizeQueueIndex = await getMinSizeQueueIndex();
        const res = await cacheClient.lPush(Environments.redis.matchQueue + `${minSizeQueueIndex}`, `${userId}`);
        if (res) {
            await updateUserCurrentQueue(userId, minSizeQueueIndex);
        }
    } catch(error) {
        console.log(enums.PrefixesForLogs.REDIS_ADD_USER_IN_MATCH_QUEUE_ERROR + error);
    } 
}

export default addUserInMatchQueue;