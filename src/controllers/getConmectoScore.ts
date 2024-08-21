import { interfaces, validationSchema, enums } from '../utils';
import { CustomError, getUserConmectoScore } from '../services';

const getConmectoScore = async (req: interfaces.IRequestObject) => {
    await validationSchema.paramsUserMatchSettingSchema.validateAsync(req.params);
    const userId = Number(req.params['userId']);
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    const setting = await getUserConmectoScore(userId);
    if (!setting) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    return {
        conmectoScore: setting.totalMatchScore
    }
}

export default getConmectoScore;