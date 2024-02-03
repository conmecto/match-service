import { redisClient1 as pubClient } from '../config';
import { Environments, helpers, enums, constants } from '../utils';
import addSetting from './addSetting';
import addUserInMatchQueue from './addUserInMatchQueue';
import { setKey } from './cache';
import logger from './logger';

export const handleAddSettingsMessage = async (message: any, channel: string) => {
    try {
        const { dob, id: userId, gender, city, country, searchIn, searchFor } = JSON.parse(message);
        const checkChannel = Environments.redis.channels.userCreatedMatch;
        const checkFields = dob && userId && city && country && searchIn && searchFor;
        if (checkChannel && checkFields) {
            const age = helpers.getAge(dob);
            const insertDoc = { age, city, country, gender, maxSearchAge: age + (age < 70 ? 1 : 0), minSearchAge: age + (age > 18 ? -1 : 0), searchFor, searchIn, userId };
            const res = await addSetting(insertDoc);
            if (!res) {
                throw new Error();
            }
            await addUserInMatchQueue(userId);
            await setKey(constants.CHECK_USER_MATCHED_KEY + userId, 'false');
            await pubClient.publish(Environments.redis.channels.processMatchQueue, enums.Messages.MATCH_QUEUE_UPDATED);
        }
    } catch(error) {
        await logger('Match Service: ' + enums.PrefixesForLogs.REDIS_CHANNEL_MESSAGE_RECEIVE_ERROR + error);
        await pubClient.publish(Environments.redis.channels.userCreatedMatchError, message);
    }
}