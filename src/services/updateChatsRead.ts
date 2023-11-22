import { QueryResult } from 'pg';
import moment from 'moment';
import { getDbClient } from '../config';
import { enums } from '../utils';

const updateChatsRead = async (matchId: number, receiver: number) => {
    const query = 'UPDATE chat SET seen=true, seen_at=$3 WHERE match_id=$1 AND receiver=$2 AND seen=false AND seen_at IS NULL AND deleted_at IS NULL';
    const params = [matchId, receiver, moment().toISOString(true)];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        console.log(query);
        console.log(params);
        res = await client.query(query, params);
    } catch(error) {
        console.error(enums.PrefixesForLogs.DB_CHAT_READ_ERROR + error);
        throw error;
    } finally {	
        client.release();
    }
}

export default updateChatsRead;