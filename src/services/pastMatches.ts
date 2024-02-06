import { QueryResult } from 'pg';
import { omit } from 'lodash';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';

const pastMatches = async (userId: number, count: number): Promise<interfaces.IGetMatchObj[]> => {
    const query = 'SELECT id, user_id_1, user_id_2, score, created_at, city, country FROM match WHERE (user_id_1=$1 OR user_id_2=$1) AND ended=true AND deleted_at IS NULL ORDER BY ended_at DESC LIMIT $2';
    const params = [userId, count];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
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

export default pastMatches;