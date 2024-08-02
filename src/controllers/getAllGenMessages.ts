import { validationSchema, enums, interfaces } from '../utils';
import { CustomError, getGenMessages } from '../services';

const getAllGenMessages = async (req: interfaces.IRequestObject) => {
    const userId = Number(req.params.userId);
    const page = Number(req.query.page);
    await validationSchema.queryParamsGenMessagesSchema.validateAsync({ userId, page });
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    const resposne = await getGenMessages(userId, page);
    return resposne;
}

export default getAllGenMessages;