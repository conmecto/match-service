import { interfaces, validationSchema, enums } from '../utils';
import { fetchUserMatches, CustomError } from '../services';

const getUserMatches = async (req: interfaces.IRequestObject) => {
    await validationSchema.paramsUserIdSchema.validateAsync(req.params);
    const userId = Number(req.params['userId']);
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const userMatches = await fetchUserMatches(userId);
    return {
        data: userMatches,
        hasMore: false
    };
}

export default getUserMatches;