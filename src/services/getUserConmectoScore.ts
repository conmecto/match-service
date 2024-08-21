import { QueryResult } from 'pg';
import { getDbClient } from '../config';

const getUserConmectoScore = async (userId: number) => {
    const query = `
        SELECT s.id, s.total_match_score
        FROM setting s 
        WHERE s.user_id=$1 AND s.deleted_at IS NULL
    `;
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
    if (res?.rows.length) {
        return {
            totalMatchScore: res.rows[0].total_match_score
        }
    }
    return null;
}

export default getUserConmectoScore;