import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { enums } from '../utils';

const checkUserSetting = async (userId: number): Promise<boolean> => {
    const query = 'SELECT id FROM setting WHERE user_id=$1';
    const params = [userId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
        throw error;
    } finally {	
        client.release();
    } 
    return Boolean(res.rows.length);
}

export default checkUserSetting;