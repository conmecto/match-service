import { interfaces, validationSchema, enums, constants } from '../utils';
import { findTopMatches } from '../services';

type QueryParams = { count: number, country: string };

const getTopMatches = async (req: interfaces.IRequestObject): Promise<interfaces.IGetMatchObj[]> => {
    let { count, country } = <QueryParams>req.query;
    await validationSchema.topMatchesQuerySchema.validateAsync({ count, country });
    if (!count) {
        count = 10;
    }
    
    const topMatches = await findTopMatches(Number(count), country);
    return topMatches;
}

export default getTopMatches;