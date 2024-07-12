import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces, helpers } from '../utils';

const getUserMatchSetting = async (userId: number) => {
    const query = `
        SELECT id, user_id, min_search_age, max_search_age, search_for, 
        search_in, active_matches_count, max_matches_allowed 
        FROM setting 
        WHERE user_id=$1 AND deleted_at IS NULL
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
    if (res?.rows.length) {
        return helpers.formatDbQueryResponse<interfaces.IGetUserMatchSettingObject>(res.rows[0]);
    }
    return null;
}

export default getUserMatchSetting;