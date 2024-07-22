import { QueryResult } from 'pg';
import moment from 'moment';
import { getDbClient } from '../config';

const markMatchSeen = async (matchId: number, userId: number) => {
    const query = `
        UPDATE match 
        SET 
        user_1_match_seen_at = CASE
            WHEN user_id_1=$2 THEN $3
            ELSE user_1_match_seen_at
        END,
        user_2_match_seen_at = CASE
            WHEN user_id_2=$2 THEN $3
            ELSE user_2_match_seen_at
        END
        WHERE id=$1 AND deleted_at IS NULL
    `;
    const params = [matchId, userId, moment().toISOString(true)];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
        throw error;
    } finally {	
        client.release();
    }
    if (res?.rowCount) {
        return true;
    }
    return null;
}

export default markMatchSeen;