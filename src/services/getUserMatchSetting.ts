import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces, helpers } from '../utils';

const getUserMatchSetting = async (userId: number) => {
    const query = `
        SELECT s.id, s.user_id, s.min_search_age, s.max_search_age, s.search_for, 
        ls.search_area, ls.geohash, ls.country
        FROM setting s 
        LEFT JOIN location_setting ls ON s.user_id=ls.user_id
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
    if (res?.rows.length) {
        return helpers.formatDbQueryResponse<interfaces.IGetUserMatchSettingObject>(res.rows[0]);
    }
    return null;
}

export default getUserMatchSetting;