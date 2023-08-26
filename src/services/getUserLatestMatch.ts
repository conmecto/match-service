import { QueryResult } from 'pg';
import { omit } from 'lodash';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';

const getUserLatestMatch = async (userId: number): Promise<interfaces.IGetMatchObj | null> => {
    const query = 'SELECT id, user_id_1, user_id_2, score, created_at FROM match WHERE (user_id_1=$1 OR user_id_2=$1) AND ended=false ORDER BY created_at desc LIMIT 1';
    const params = [userId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        console.log(query);
        console.log(params);
        res = await client.query(query, params);
    } catch(error) {
        console.error(enums.PrefixesForLogs.DB_GET_CURRENT_MATCH_ERROR + error);
        throw error;
    } finally {	
        client.release();
    } 
    if (res.rows.length) {
        return <interfaces.IGetMatchObj>{ 
            ...omit(res.rows[0], 'user_id_1', 'user_id_2', 'created_at'), 
            userId1: res.rows[0]['user_id_1'],
            userId2: res.rows[0]['user_id_2'],
            createdAt: res.rows[0]['created_at'],
        }
    }
    return null;
}

export default getUserLatestMatch;