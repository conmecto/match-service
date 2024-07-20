import { interfaces, validationSchema, enums } from '../utils';
import { CustomError, getUserMatchSetting } from '../services';

const getUserSettings = async (req: interfaces.IRequestObject) => {
    await validationSchema.paramsUserMatchSettingSchema.validateAsync(req.params);
    const userId = Number(req.params['userId']);
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const userSettings = await getUserMatchSetting(userId);
    if (!userSettings) {
        throw new CustomError(
            enums.StatusCodes.NOT_FOUND, 
            enums.Errors.USER_MATCH_SETTING_NOT_FOUND, 
            enums.ErrorCodes.SETTING_NOT_FOUND
        );
    }
    return userSettings;
}

export default getUserSettings;