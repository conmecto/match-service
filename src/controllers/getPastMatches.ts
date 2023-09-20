import { interfaces, validationSchema, enums, constants } from '../utils';
import { pastMatches } from '../services';

type QueryParams = { count: number, userId: number };

const getPastMatches = async (req: interfaces.IRequestObject): Promise<interfaces.IGetMatchObj[]> => {
    let { count, userId } = <QueryParams>req.query;
    await validationSchema.pastMatchesQuerySchema.validateAsync({ count, userId });
    if (!count) {
        count = 10;
    }
    
    const matches = await pastMatches(Number(userId), Number(count));
    return matches;
}

export default getPastMatches;