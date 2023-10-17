import getMatchById from './getMatchById';
import createChatRoom from './createChatRoom';
import { setKey } from './cache';
import { enums, constants } from '../utils';
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
            createChatRoom({ ...match, matchId: match.id }),
            setKey(constants.CHECK_USER_MATCHED_KEY + userId1, userId2?.toString()),
            setKey(constants.CHECK_USER_MATCHED_KEY + userId2, userId1?.toString()),
        ]);
    } catch(error) {
        console.error(enums.PrefixesForLogs.REDIS_HANDLE_MATCH_CREATED_ERROR + error);
    }
}

export default handleMatchCreatedMessage;