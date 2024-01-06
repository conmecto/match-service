import { interfaces, validationSchema } from '../utils';
import { updateChatsRead } from '../services';

const markChatsRead = async (req: interfaces.IRequestObject) => {
    const { matchId } = req.params;
    const { userId } = req.body;
    console.log('userId', userId)
    await validationSchema.endMatchSchema.validateAsync({ matchId, userId });
    await updateChatsRead(matchId, userId);
    return { 
        message: 'Chats updated successfully'
    }
}

export default markChatsRead;