import { omit } from 'lodash';
import { interfaces, validationSchema, enums } from '../utils';
import { CustomError, updateMatchSettings, addUserInMatchQueue } from '../services';

const updateUserSettings = async (req: interfaces.IRequestObject): Promise<interfaces.IGetSettingObject> => {
    await validationSchema.updateUserMatchSettingSchema.validateAsync(req.body);
    const userId = Number(req.params['userId']);
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const { minSearchAge, maxSearchAge, searchFor, searchIn } = req.body;
    const updateObj: interfaces.IUpdateSettingObj = {};
    if (searchFor) {
        updateObj.searchFor = searchFor?.toLowerCase();
    }
    if (searchIn) {
        updateObj.searchIn = searchIn?.toLowerCase();
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
    return omit(userSettings, ['currentQueue']);
}

export default updateUserSettings;