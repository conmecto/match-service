import { getDbClient } from '../config';
import { QueryResult } from 'pg';
import { enums } from '../utils';

const updateSettingPostEndMatch = async (userId: number, currentQueue: number) => {
	const query = `UPDATE setting SET current_queue=$2, avg_match_time=
        (SELECT ROUND(SUM(score) * 1.0 / COUNT(*), 2) AS avg_match_time FROM match WHERE (user_id_1=$1 OR user_id_2=$1) AND ended=true AND deleted_at IS NULL), 
        is_matched=false WHERE user_id=$1`;
    const params = [userId, currentQueue];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        console.log(query);
        console.log(params);
        res = await client.query(query, params);
    } catch(error) {
        console.error(enums.PrefixesForLogs.DB_UPDATE_SETTING_POST_END_MATCH_ERROR + error);
        throw error;
    } finally {	
        client.release();
    }
    return Boolean(res?.rowCount);
} 

export default updateSettingPostEndMatch;