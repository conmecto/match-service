import getMatchById from './getMatchById';
import { setKey } from './cache';
import { enums, constants } from '../utils';
import logger from './logger';

const handleMatchCreatedMessage = async (message: string, channel: string) => {
    try {
        const matchId = Number(message);
        const match = await getMatchById(matchId);
        if (!match) {
            throw new Error();
        }
        const userId1 = match.userId1;
        const userId2 = match.userId2;
        await Promise.all([
            setKey(constants.CHECK_USER_MATCHED_KEY + userId1, userId2?.toString()),
            setKey(constants.CHECK_USER_MATCHED_KEY + userId2, userId1?.toString()),
        ]);
    } catch(error) {
        await logger('Match Service: ' + enums.PrefixesForLogs.REDIS_HANDLE_MATCH_CREATED_ERROR + error);
    }
}

export default handleMatchCreatedMessage;