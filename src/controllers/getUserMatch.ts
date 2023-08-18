import { interfaces, validationSchema, enums, constants } from '../utils';
import { getUserLatestMatch, CustomError, cacheClient, checkUserSetting } from '../services';

const getUserMatch = async (req: interfaces.IRequestObject): Promise<interfaces.IGetMatchObj | undefined> => {
    await validationSchema.paramsUserIdSchema.validateAsync(req.params);
    const userId = Number(req.params['id']);

    let checkUserId: string | null | boolean = await cacheClient.getKey(constants.CHECK_USER_MATCHED_KEY + userId);
    if (!checkUserId) {
        checkUserId = await checkUserSetting(userId);
    }
    if (!checkUserId) {
        throw new CustomError(enums.StatusCodes.NOT_FOUND, enums.Errors.USER_MATCH_SETTING_NOT_FOUND, enums.ErrorCodes.SETTING_NOT_FOUND);
    }
    const userMatch = await getUserLatestMatch(userId);
    if (!userMatch) {
        return;
    }
    return userMatch;
}

export default getUserMatch;