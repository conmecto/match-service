import { QueryResult } from 'pg';
import moment from 'moment';
import { getDbClient } from '../config';

const checkTextGenerateLimit = async (userId: number) => {
    const query = `
        SELECT id
        FROM text_gen_setting
        WHERE user_id=$1 AND ((current < max) OR (last_reset_at < $2))
    `;
    const lastValidDate = moment().subtract(24, 'hours').toISOString(true);
    const params = [userId, lastValidDate];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(err) {
        throw err;
    } finally {	
        client.release();
    }
    if (res?.rows?.length) {
      return true;
    }
    return false;
}

export default checkTextGenerateLimit;