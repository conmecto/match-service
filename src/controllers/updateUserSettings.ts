import { interfaces, validationSchema, enums } from '../utils';
import { CustomError, updateMatchSettings } from '../services';

const updateUserSettings = async (req: interfaces.IRequestObject) => {
    await validationSchema.updateUserMatchSettingSchema.validateAsync(req.body);
    const userId = Number(req.params['userId']);
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const { minSearchAge, maxSearchAge, searchFor, searchArea, gender } = req.body;
    const updateObj: interfaces.IUpdateSettingObj = {};
    if (searchFor) {
        updateObj.searchFor = searchFor?.toLowerCase();
    }
    if (gender) {
        updateObj.gender = gender?.toLowerCase();
    }
    if ((minSearchAge && !maxSearchAge) || (maxSearchAge && !minSearchAge)) {
        throw new CustomError(
            enums.StatusCodes.BAD_REQUEST, 
            enums.Errors.INVALID_AGE_LIMIT_SETTING, 
            enums.ErrorCodes.INVALID_AGE_LIMIT_SETTING
        );       
    }
    if (minSearchAge && maxSearchAge) {
        if (maxSearchAge - minSearchAge > 2) {
            throw new CustomError(
                enums.StatusCodes.BAD_REQUEST, 
                enums.Errors.INVALID_AGE_LIMIT_SETTING, 
                enums.ErrorCodes.INVALID_AGE_LIMIT_SETTING
            );       
        }
        updateObj.maxSearchAge = maxSearchAge;
        updateObj.minSearchAge = minSearchAge;
    }
    const userSettings = await updateMatchSettings(userId, updateObj, searchArea?.toLowerCase());
    if (!userSettings) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    return { id: userId, ...updateObj, ...(searchArea ? { searchArea } : {}) };
}

export default updateUserSettings;