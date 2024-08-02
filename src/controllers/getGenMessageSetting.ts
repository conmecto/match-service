import moment from 'moment';
import { validationSchema, enums, interfaces } from '../utils';
import { CustomError, getTextGenSetting } from '../services';

const getGenMessageSetting = async (req: interfaces.IRequestObject) => {
    const userId = Number(req.params.userId);
    await validationSchema.paramsUserIdSchema.validateAsync({ userId });
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const textGenSettingObj = await getTextGenSetting(userId);
    if (!textGenSettingObj) {
        throw new CustomError(enums.StatusCodes.NOT_FOUND, enums.Errors.TEXT_GEN_SETTING_NOT_FOUND, enums.ErrorCodes.TEXT_GEN_SETTING_NOT_FOUND);
    }
    const lastValidDate = moment().subtract(24, 'hours').utc().toDate();
    if (
        textGenSettingObj.current === textGenSettingObj.max && 
        textGenSettingObj.lastResetAt && 
        textGenSettingObj.lastResetAt > lastValidDate
    ) {
        textGenSettingObj.isWaitingPeriod = true;
    } else {
        if (textGenSettingObj.current === textGenSettingObj.max) {
            textGenSettingObj.current = 0;
        }
        textGenSettingObj.isWaitingPeriod = false;
    }
    return textGenSettingObj;
}

export default getGenMessageSetting;