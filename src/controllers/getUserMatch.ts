import { interfaces, validationSchema, enums } from '../utils';
import { getUserLatestMatch, CustomError } from '../services';

const getUserMatch = async (req: interfaces.IRequestObject): Promise<interfaces.IGetMatchObj | undefined> => {
    await validationSchema.paramsUserIdSchema.validateAsync(req.params);
    const userId = Number(req.params['id']);
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const userMatch = await getUserLatestMatch(userId);
    if (!userMatch) {
        return;
    }
    return userMatch;
}

export default getUserMatch;