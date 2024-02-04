import { interfaces, validationSchema, enums } from '../utils';
import { pastMatches, CustomError } from '../services';

type QueryParams = { count: number, userId: number };

const getPastMatches = async (req: interfaces.IRequestObject): Promise<interfaces.IGetMatchObj[]> => {
    let { count, userId } = <QueryParams>req.query;
    await validationSchema.pastMatchesQuerySchema.validateAsync({ count, userId });
    const user = req.user;
    if (!user) {
        throw new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    if (Number(user.userId) !== Number(userId)) {
        throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
    }
    if (!count) {
        count = 10;
    }
    const matches = await pastMatches(Number(userId), Number(count));
    return matches;
}

export default getPastMatches;