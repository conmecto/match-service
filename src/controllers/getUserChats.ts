import { interfaces, validationSchema, enums } from '../utils';
import { getChats, CustomError } from '../services';

const getUserChats = async (req: interfaces.IRequestObject) => {
    await validationSchema.paramsMatchIdSchema.validateAsync(req.params);
    await validationSchema.queryParamsUserChatsSchema.validateAsync(req.query);
    const { matchId } = req.params; 
    const { userId, page, perPage } = req.query;
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const chats = await getChats({ 
        matchId: Number(matchId), 
        userId:  Number(userId), 
        page: Number(page), 
        perPage: Number(perPage) 
    });
    return {
        data: chats,
        hasMoreChats: chats.length ? chats[0].hasMore : false
    };
}

export default getUserChats;