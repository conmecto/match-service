import { interfaces, validationSchema, enums, constants } from '../utils';
import { markMatchEnded, CustomError, addUserInMatchQueue, updateSettingPostEndMatch, cacheClient } from '../services';

const endMatch = async (req: interfaces.IRequestObject) => {
    const { matchId } = req.params;
    const { userId } = req.body;
    await validationSchema.endMatchSchema.validateAsync({ matchId, userId });
    const res = await markMatchEnded(matchId, userId);
    if (!res) {
        throw new CustomError(enums.StatusCodes.NOT_FOUND, enums.Errors.MATCH_NOT_FOUND, enums.ErrorCodes.MATCH_NOT_FOUND);
    }
    const queueUser1 = await addUserInMatchQueue(res.userId1, false);
    if (queueUser1) {
        await updateSettingPostEndMatch(res.userId1, queueUser1);
    }
    const queueUser2 = await addUserInMatchQueue(res.userId2, false);
    if (queueUser2) {
        await updateSettingPostEndMatch(res.userId2, queueUser2);
    }
    await Promise.all([
        cacheClient.setKey(constants.CHECK_USER_MATCHED_KEY + res.userId1, 'false'),
        cacheClient.setKey(constants.CHECK_USER_MATCHED_KEY + res.userId2, 'false')
    ]);
    return { 
        message: 'Match ended successfully'
    }
}

export default endMatch;