import { interfaces, validationSchema, enums } from '../utils';
import { markMatchEnded, CustomError } from '../services';
import { clearChatSocketClient } from '../config/chatSocket';

const endMatch = async (req: interfaces.IRequestObject) => {
    const { matchId } = req.params;
    const { userId, block } = req.body;
    await validationSchema.endMatchSchema.validateAsync({ matchId, userId, block });
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const res = await markMatchEnded(matchId, userId, block);
    if (!res) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    clearChatSocketClient(matchId, res.userId1?.toString());
    clearChatSocketClient(matchId, res.userId2?.toString());
    return { 
        message: 'Match ended successfully'
    }
}

export default endMatch;