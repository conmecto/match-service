import { redisClient1 as pubClient, redisClient2 as subClient } from '../config';
import { Environments, helpers, enums } from '../utils';
import addSetting from './addSetting';

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
        }
    } catch(err) {
        console.log(enums.PrefixesForLogs.REDIS_CHANNEL_MESSAGE_RECEIVE_ERROR + err);
        await pubClient.publish(Environments.redis.channels.userCreatedMatchError, message);
    }
}