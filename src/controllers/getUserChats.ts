import { interfaces, validationSchema, enums, constants } from '../utils';
import { getChats } from '../services';

const getUserChats = async (req: interfaces.IRequestObject): Promise<interfaces.IChatsResponse[]> => {
    await validationSchema.paramsMatchIdSchema.validateAsync(req.params);
    await validationSchema.queryParamsUserChatsSchema.validateAsync(req.query);
    const { matchId } = req.params; 
    const { userId, page, perPage } = req.query;
    const chats = await getChats({ 
        matchId: Number(matchId), 
        userId:  Number(userId), 
        page: Number(page), 
        perPage: Number(perPage) 
    });
    console.log('chats', JSON.stringify(chats))
    return chats;
}

export default getUserChats;