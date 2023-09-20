import { interfaces, validationSchema, enums } from '../utils';
import { CustomError, getUserMatchSetting } from '../services';

const getUserSettings = async (req: interfaces.IRequestObject): Promise<interfaces.IGetSettingObject> => {
    await validationSchema.paramsUserMatchSettingSchema.validateAsync(req.params);
    const userId = Number(req.params['userId']);

    const userSettings = await getUserMatchSetting(userId);
    if (!userSettings) {
        throw new CustomError(enums.StatusCodes.NOT_FOUND, enums.Errors.USER_MATCH_SETTING_NOT_FOUND, enums.ErrorCodes.SETTING_NOT_FOUND);
    }
    return userSettings;
}

export default getUserSettings;