import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { enums } from '../utils';

const blockUser = async (userId1: number, userId2: number): Promise<boolean> => {
    const query = 'INSERT INTO match_block(user_id_1, user_id_2) VALUES ($1, $2) RETURNING match_block.id';
    const params = [userId1, userId2];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
        throw error;
    } finally {	
        client.release();
    }
    if (res?.rows?.length) {
      return true;
    }
    return false;
}

export default blockUser;