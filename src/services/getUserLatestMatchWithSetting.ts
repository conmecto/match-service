import { QueryResult } from 'pg';
import { omit } from 'lodash';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';

const getUserLatestMatchWithSetting = async (userId: number): Promise<interfaces.IGetMatchObjWithSetting | null> => {
    const query = `
        SELECT s.id, s.total_match_score, s.user_id, e.id AS embedding_id, m.id AS match_id, m.user_id_1, m.user_id_2, m.score, m.city, m.country, m.created_at 
        FROM setting s 
        LEFT JOIN embeddings e ON e.user_id=s.user_id 
        LEFT JOIN match m ON m.id=(
            SELECT a.id FROM match a 
            WHERE (a.user_id_1=$1 OR a.user_id_2=$1) AND a.ended=false ORDER BY a.created_at DESC LIMIT 1
        ) 
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
    if (res.rows.length) {
        const temp = res.rows[0];
        return { 
            settingId: temp.id,
            userId: temp.user_id,
            totalMatchScore: temp.total_match_score,
            pinnedPostId: temp?.embedding_id,
            id: temp?.match_id,
            userId1: temp?.user_id_1,
            userId2: temp?.user_id_2,
            score: temp?.score,
            createdAt: temp?.created_at,
            city: temp?.city,
            country: temp?.country
        }
    }
    return null;
}

export default getUserLatestMatchWithSetting;