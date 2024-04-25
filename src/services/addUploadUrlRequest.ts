import { QueryResult } from 'pg';
import { getDbClient } from '../config';

const addUploadUrlRequest = async (userId: number, matchId: number): Promise<boolean> => {
    const query = 'INSERT INTO upload_url_request(user_id, match_id) VALUES ($1, $2) RETURNING upload_url_request.id';
    const params = [userId, matchId];
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

export default addUploadUrlRequest;