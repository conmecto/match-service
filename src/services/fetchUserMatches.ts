import { QueryResult } from 'pg';
import { omit } from 'lodash';
import { getDbClient } from '../config';
import { interfaces, helpers } from '../utils';

const fetchUserMatches = async (userId: number) => {
    const query = `
        WITH latest_message AS (
            SELECT id AS chat_id, match_id, created_at,
            ROW_NUMBER() OVER (PARTITION BY c.match_id ORDER BY c.created_at DESC) rn
            FROM chat c
            WHERE c.receiver=$1 AND c.seen=false AND c.deleted_at IS NULL
        ),
        top_matches AS (
            SELECT m.id AS id, m.user_id_1, m.user_id_2, m.score, m.country, m.created_at,
            m.user_1_match_seen_at, m.user_2_match_seen_at
            FROM match m 
            WHERE (m.user_id_1=$1 OR m.user_id_2=$1) AND m.ended=false 
            ORDER BY m.created_at DESC 
            LIMIT 5
        )
        SELECT tm.*, lm.chat_id
        FROM top_matches tm 
        LEFT JOIN latest_message lm ON lm.match_id=tm.id AND lm.rn=1
        ORDER BY lm.created_at DESC
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
        return res.rows.map(match => {
            const formatedMatch = helpers.formatDbQueryResponse<interfaces.IGetMatchDbResponse>(match);
            const response: interfaces.IGetMatchListObj = { 
                ...omit(formatedMatch, ['chatId']),
                chatNotification: !!formatedMatch.chatId,
            };
            return response;
        });
    }
    return [];
}

export default fetchUserMatches;