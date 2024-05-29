import { interfaces, validationSchema, enums } from '../utils';
import { reportChatMessage, CustomError } from '../services';

const reportChat = async (req: interfaces.IRequestObject) => {
    const user = req.user;
    if (!user?.userId) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const { matchId, chatId } = req.params; 
    await validationSchema.reportChatSchema.validateAsync({ matchId, chatId, userId: user.userId });
    await reportChatMessage(matchId, user.userId, chatId);
    return {
        message: 'Chat reported'
    };
}

export default reportChat;