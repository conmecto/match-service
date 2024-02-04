import { interfaces, validationSchema, enums } from '../utils';
import { updateChatsRead, CustomError } from '../services';

const markChatsRead = async (req: interfaces.IRequestObject) => {
    const { matchId } = req.params;
    const { userId } = req.body;
    await validationSchema.markChatsReadSchema.validateAsync({ matchId, userId });
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    await updateChatsRead(matchId, userId);
    return { 
        message: 'Chats updated successfully'
    }
}

export default markChatsRead;