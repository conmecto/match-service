import { QueryResult } from 'pg';
import { omit } from 'lodash';
import moment from 'moment';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';

const getChats = async (payload: interfaces.IGetChatsPayload): Promise<interfaces.IChatsResponse[]> => {
    const oneDayPastTime = moment().subtract(24, 'hours').toISOString(true);
    const query = 'SELECT id, sender, receiver, match_id, message, type, seen, seen_at, created_at, deleted_at FROM chat WHERE match_id=$1 AND (sender=$2 OR receiver=$2) AND created_at > $3 AND deleted_at IS NULL ORDER BY created_at DESC OFFSET $4 LIMIT $5';
    const params = [payload.matchId, payload.userId, oneDayPastTime, (payload.page - 1) * payload.perPage, payload.perPage];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        console.log(query);
        console.log(params);
        res = await client.query(query, params);
    } catch(error) {
        console.error(enums.PrefixesForLogs.DB_GET_USER_CHATS_ERROR + error);
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
        }
    }) : [];
}

export default getChats;