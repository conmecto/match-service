import { interfaces, validationSchema, enums } from '../utils';
import { CustomError, updateMatchSettings, addUserInMatchQueue } from '../services';

const updateUserSettings = async (req: interfaces.IRequestObject): Promise<interfaces.IGetSettingObject> => {
    await validationSchema.updateUserMatchSettingSchema.validateAsync(req.body);
    const userId = Number(req.params['userId']);
    const { minSearchAge, maxSearchAge, searchFor, searchIn } = req.body;
    const updateObj: interfaces.IUpdateSettingObj = {};
    if (searchFor) {
        updateObj.searchFor = searchFor;
    }
    if (searchIn) {
        updateObj.searchIn = searchIn;
    }
    if ((minSearchAge && !maxSearchAge) || (maxSearchAge && !minSearchAge)) {
        throw new CustomError(enums.StatusCodes.BAD_REQUEST, enums.Errors.INVALID_AGE_LIMIT_SETTING, enums.ErrorCodes.INVALID_AGE_LIMIT_SETTING);       
    }
    if (minSearchAge && maxSearchAge) {
        if (maxSearchAge - minSearchAge > 2) {
            throw new CustomError(enums.StatusCodes.BAD_REQUEST, enums.Errors.INVALID_AGE_LIMIT_SETTING, enums.ErrorCodes.INVALID_AGE_LIMIT_SETTING);       
        }
        updateObj.maxSearchAge = maxSearchAge;
        updateObj.minSearchAge = minSearchAge;
    }

    const userSettings = await updateMatchSettings(userId, updateObj);
    if (!userSettings) {
        throw new CustomError(enums.StatusCodes.NOT_FOUND, enums.Errors.USER_MATCH_SETTING_NOT_FOUND, enums.ErrorCodes.SETTING_NOT_FOUND);
    }
    if (!userSettings.isMatched && !userSettings.currentQueue) {
        await addUserInMatchQueue(userSettings.userId);
    }
    return userSettings;
}

export default updateUserSettings;