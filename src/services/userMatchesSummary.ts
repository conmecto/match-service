import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces, helpers } from '../utils';

const userMatchesSummary = async (userId: number) => {
    const query = `
        SELECT s.id, s.active_matches_count, s.total_match_score::INT, s.user_id, 
        m.id AS match_id, m.score,
            CASE 
                WHEN (m.ended) 
                    THEN FLOOR(
                        EXTRACT(EPOCH from (m.ended_at::TIMESTAMP - m.created_at::TIMESTAMP)) / 3600
                    )::INT
                ELSE FLOOR(
                    EXTRACT(EPOCH FROM (NOW() - m.created_at::TIMESTAMP)) / 3600
                )::INT
            END AS match_duration_hours
        FROM setting s
        LEFT JOIN match m ON (m.user_id_1=s.user_id OR m.user_id_2=s.user_id) 
        WHERE user_id=$1
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
    if (!res.rows.length) {
        return null;
    }
    return res.rows.map(response => {
        return helpers.formatDbQueryResponse<interfaces.IUserMatchSummaryObj>(response);
    });
}

export default userMatchesSummary;