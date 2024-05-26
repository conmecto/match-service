import { QueryResult } from 'pg';
import { omit } from 'lodash';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';

const fetchUserMatches = async (userId: number): Promise<interfaces.IGetMatchObjWithSetting[]> => {
    const query = `
        WITH latest_message AS (
            SELECT id, match_id,
            ROW_NUMBER() OVER (PARTITION BY c.match_id ORDER BY c.created_at DESC) rn
            FROM chat c
            WHERE c.receiver=$1 AND c.seen=false AND c.deleted_at IS NULL
        ),
        top_matches AS (
            SELECT m.id AS match_id, m.user_id_1, m.user_id_2, m.score, m.city, m.country, m.created_at
            FROM match m 
            WHERE (m.user_id_1=$1 OR m.user_id_2=$1) AND m.ended=false 
            ORDER BY m.created_at DESC 
            LIMIT 2
        )
        SELECT tm.*, lm.id
        FROM top_matches tm
        LEFT JOIN latest_message lm ON lm.match_id=tm.match_id AND lm.rn=1
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
    if (res.rows.length) {
        return res.rows.map(temp => ({ 
            id: temp.match_id,
            userId1: temp.user_id_1,
            userId2: temp.user_id_2,
            score: temp.score,
            createdAt: temp.created_at,
            city: temp.city,
            country: temp.country,
            chatNotification: !!temp?.id
        }));
    }
    return [];
}

export default fetchUserMatches;