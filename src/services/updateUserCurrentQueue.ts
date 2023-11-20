import { getDbClient } from '../config';
import { QueryResult } from 'pg';
import { interfaces, enums } from '../utils';

const updateUserCurrentQueue = async (userId: number, currentQueue: number) => {
	const query = 'UPDATE setting SET current_queue=$1, is_matched=false WHERE user_id=$2';
    const params = [currentQueue, userId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        console.log(query);
        console.log(params);
        res = await client.query(query, params);
    } catch(error) {
        console.error(enums.PrefixesForLogs.DB_UPDATE_USER_CURRENT_QUEUE_ERROR + error);
        throw error;
    } finally {	
        client.release();
    }
    return Boolean(res?.rowCount);
} 

export default updateUserCurrentQueue;