import { interfaces, validationSchema, enums } from '../utils';
import { markMatchSeen, CustomError,  } from '../services';

const updateUserMatchSeen = async (req: interfaces.IRequestObject) => {
    const { matchId, userId } = req.params;
    await validationSchema.matchSeenSchema.validateAsync({ matchId, userId });
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const res = await markMatchSeen(matchId, userId);
    if (!res) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    return { 
        message: 'Match seen updated successfully'
    }
}

export default updateUserMatchSeen;