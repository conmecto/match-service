import { getDbClient } from '../config';
import { QueryResult } from 'pg';
import { enums } from '../utils';

const updateSettingPostEndMatch = async (userIds: number[], queue: number[]) => {
    /**
     * add avg_match_time in update query using cte 
     * avg_match_time =
                        CASE
                        WHEN user_id=$1 THEN 
                        (
                            SELECT ROUND(((SUM(score) * 1.0 / COUNT(*))::numeric), 2) AS avg_match_time 
                            FROM match 
                            WHERE (user_id_1=$1 OR user_id_2=$1) AND ended=true AND deleted_at IS NULL
                        ) 
                        WHEN user_id=$2 THEN 
                        (
                            SELECT ROUND(((SUM(score) * 1.0 / COUNT(*))::numeric), 2) AS avg_match_time 
                            FROM match 
                            WHERE (user_id_1=$2 OR user_id_2=$2) AND ended=true AND deleted_at IS NULL
                        ) 
                        END
     */
    const query = `
        UPDATE setting 
        SET 
            current_queue = (CASE
                            WHEN user_id=$1 THEN $3
                            WHEN user_id=$2 THEN $4
                            ELSE 1
                            END)
        WHERE user_id IN ($1, $2)
    `;
    const params = [...userIds, ...queue];
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