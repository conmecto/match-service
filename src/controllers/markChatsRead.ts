import { interfaces, validationSchema } from '../utils';
import { updateChatsRead } from '../services';

const markChatsRead = async (req: interfaces.IRequestObject) => {
    const { matchId } = req.params;
    const { userId } = req.body;
    await validationSchema.markChatsReadSchema.validateAsync({ matchId, userId });
    await updateChatsRead(matchId, userId);
    return { 
        message: 'Chats updated successfully'
    }
}

export default markChatsRead;