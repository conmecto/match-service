import { redisClient1 as pubClient } from '../config';
import { Environments, helpers, enums, interfaces } from '../utils';
import addSetting from './addSetting';
import addUserInMatchQueue from './addUserInMatchQueue';
import { updateUserGeohashCache } from './geohash';
import logger from './logger';

export const handleAddSettingsMessage = async (message: any, channel: string) => {
    try {
        const { dob, id: userId, gender, country, searchFor } = JSON.parse(message);
        const checkChannel = Environments.redis.channels.userCreatedMatch === channel;
        const checkFields = dob && userId && country && searchFor;
        if (checkChannel && checkFields) {
            const age = helpers.getAge(dob);
            const settingDoc = { 
                age, 
                gender, 
                maxSearchAge: age + (age < 70 ? 1 : 0), 
                minSearchAge: age + (age > 18 ? -1 : 0), 
                searchFor, 
                userId 
            };
            const locationDoc: interfaces.ICreateLocationSettingObject = {
                country,
                userId,
            }
            const res = await addSetting(settingDoc, locationDoc);
            if (!res) {
                throw new Error();
            }
            await addUserInMatchQueue(userId);
            await pubClient.publish(Environments.redis.channels.processMatchQueue, enums.Messages.MATCH_QUEUE_UPDATED);
        }
    } catch(error: any) {
        const errorString = JSON.stringify({
            stack: error?.stack,
            message: error?.toString()
        });
        await logger(enums.PrefixesForLogs.REDIS_CHANNEL_MESSAGE_RECEIVE_ERROR + errorString);
        await pubClient.publish(Environments.redis.channels.userCreatedMatchError, message);
    }
}