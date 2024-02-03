import { QueryResult } from 'pg';
import { omit } from 'lodash';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';

const getMatchById = async (matchId: number): Promise<interfaces.IGetMatchObj | null> => {
    const query = 'SELECT id, user_id_1, user_id_2, score, created_at FROM match WHERE id=$1';
    const params = [matchId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
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

export default getMatchById;