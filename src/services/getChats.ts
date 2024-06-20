import { QueryResult } from 'pg';
import { omit } from 'lodash';
import moment from 'moment';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';

const getChats = async (payload: interfaces.IGetChatsPayload) => {
    const oneDayPastTime = moment().subtract(24, 'hours').toISOString(true);
    const query = `
        WITH total_count AS (
            SELECT count(*) AS count 
            FROM chat 
            WHERE match_id=$1 AND (sender=$2 OR receiver=$2) AND created_at > $3 AND reported=false AND deleted_at IS NULL
        ),
        paginated_results AS (
            SELECT id, sender, receiver, match_id, message, type, seen, seen_at, created_at, deleted_at, location, 
            (SELECT count > $6 FROM total_count) AS has_more
            FROM chat
            WHERE match_id=$1 AND (sender=$2 OR receiver=$2) AND created_at > $3 AND reported=false AND deleted_at IS NULL 
            ORDER BY created_at DESC 
            OFFSET $4
            LIMIT $5
        )
        SELECT * FROM paginated_results
    `;
    const countSkip = payload.skip + payload.perPage;
    const params = [
        payload.matchId, payload.userId, oneDayPastTime, payload.skip, 
        payload.perPage, countSkip
    ];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
        throw error;
    } finally {	
        client.release();
    }
    return res?.rows?.length ? res.rows.map(chat => {
        return <interfaces.IChatsResponse>{ 
            ...omit(chat, ['match_id', 'seen_at', 'created_at', 'deleted_at']),
            matchId: chat['match_id'],
            seenAt: chat['seen_at'],
            createdAt: chat['created_at'],
            deletedAt: chat['deleted_at'],
            hasMore: chat['has_more']
        }
    }) : [];
}

export default getChats;