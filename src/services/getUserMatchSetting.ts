import { QueryResult } from 'pg';
import { omit } from 'lodash';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';

const getUserMatchSetting = async (userId: number): Promise<interfaces.IGetSettingObject | null> => {
    const query = 'SELECT id, user_id, min_search_age, max_search_age, search_for, search_in FROM setting WHERE user_id=$1 AND deleted_at IS NULL';
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
        return <interfaces.IGetSettingObject>{
            ...omit(res.rows[0], ['user_id', 'min_search_age', 'max_search_age', 'search_in', 'search_for']),
            userId: res.rows[0]['user_id'],
            minSearchAge: res.rows[0]['min_search_age'],
            maxSearchAge: res.rows[0]['max_search_age'],
            searchFor: res.rows[0]['search_for'],
            searchIn: res.rows[0]['search_in'],
        };
    }
    return null;
}

export default getUserMatchSetting;