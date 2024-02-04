import { interfaces, validationSchema } from '../utils';
import { getUserLatestMatch } from '../services';

const getUserMatch = async (req: interfaces.IRequestObject): Promise<interfaces.IGetMatchObj | undefined> => {
    await validationSchema.paramsUserIdSchema.validateAsync(req.params);
    const userId = Number(req.params['id']);
    const userMatch = await getUserLatestMatch(userId);
    if (!userMatch) {
        return;
    }
    return userMatch;
}

export default getUserMatch;