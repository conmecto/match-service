import { QueryResult } from 'pg';
import { omit } from 'lodash';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';

const findTopMatches = async (count: number, country: string): Promise<interfaces.IGetMatchObj[]> => {
    //const query = 'SELECT id, user_id_1, user_id_2, score, created_at, city, country FROM match WHERE ended=false AND country=$1 AND deleted_at IS NULL ORDER BY score DESC LIMIT $2';
    const query = 'SELECT id, user_id_1, user_id_2, score, created_at, city, country FROM match WHERE country=$1 AND deleted_at IS NULL ORDER BY score DESC LIMIT $2';
    const params = [country, count];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        console.log(query);
        console.log(params);
        res = await client.query(query, params);
    } catch(error) {
        console.error(enums.PrefixesForLogs.DB_GET_TOP_MATCHES_ERROR + error);
        throw error;
    } finally {	
        client.release();
    }
    return res?.rows ? res.rows.map(match => {
        return <interfaces.IGetMatchObj>{ 
            ...omit(match, 'user_id_1', 'user_id_2', 'created_at'), 
            userId1: match['user_id_1'],
            userId2: match['user_id_2'],
            createdAt: match['created_at'],
        }
    }) : [];
}

export default findTopMatches;