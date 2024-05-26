import { getDbClient } from '../config';
import { QueryResult } from 'pg';
import { enums } from '../utils';

const updateSettingPostEndMatch = async (userId: number, currentQueue: number) => {
	const query = `
        UPDATE setting 
        SET current_queue=$2, active_matches_count=active_matches_count-1
        avg_match_time=
        (
            SELECT ROUND(((SUM(score) * 1.0 / COUNT(*))::numeric), 2) AS avg_match_time 
            FROM match 
            WHERE (user_id_1=$1 OR user_id_2=$1) AND ended=true AND deleted_at IS NULL
        ) 
        WHERE user_id=$1
    `;
    const params = [userId, currentQueue];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
        throw error;
    } finally {	
        client.release();
    }
    return Boolean(res?.rowCount);
} 

export default updateSettingPostEndMatch;