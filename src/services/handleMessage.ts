import { redisClient1 as pubClient, redisClient2 as subClient } from '../config';
import { Environments, helpers, enums } from '../utils';
import addSetting from './addSetting';
import addUserInMatchQueue from './addUserInMatchQueue';

export const handleAddSettingsMessage = async (message: any, channel: string) => {
    try {
        const { dob, id: userId, gender, city, country, searchIn, searchFor } = JSON.parse(message);
        const checkChannel = Environments.redis.channels.userCreatedMatch;
        const checkFields = dob && userId && city && country && searchIn && searchFor;
        if (checkChannel && checkFields) {
            const age = helpers.getAge(dob);
            const insertDoc = { age, userId, city, country, searchIn, searchFor, gender };
            const res = await addSetting(insertDoc);
            if (!res) {
                throw new Error();
            }
            await addUserInMatchQueue(userId);
            await pubClient.publish(Environments.redis.channels.processMatchQueue, enums.Messages.MATCH_QUEUE_UPDATED);
        }
    } catch(error) {
        console.log(enums.PrefixesForLogs.REDIS_CHANNEL_MESSAGE_RECEIVE_ERROR + error);
        await pubClient.publish(Environments.redis.channels.userCreatedMatchError, message);
    }
}