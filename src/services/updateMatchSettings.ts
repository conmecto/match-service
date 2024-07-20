import { getDbClient } from '../config';
import { QueryResult } from 'pg';
import { interfaces, enums } from '../utils';

const updateMatchSettings = async (
    userId: number, 
    updateObj: interfaces.IUpdateSettingObj,
    searchArea: string = ''
) => {
	const keys = Object.keys(updateObj).map(
        (key, index) => `${enums.FieldsDbName[key]}=$${index+2}`
    ).join(',');
    const query1 = `
        UPDATE setting SET 
        ${keys}
        WHERE user_id=$1 
        RETURNING setting.user_id
    `; 
    const params1 = [userId, ...Object.values(updateObj)];
    const query2 = `
        UPDATE location_setting SET 
        search_area=$2
        WHERE user_id=$1 
        RETURNING location_setting.user_id
    `; 
    const params2 = [userId, searchArea];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        if (keys.length) {
            res = await client.query(query1, params1);
        }
        if (searchArea) {
            res = await client.query(query2, params2);
        }
    } catch(error) {
        throw error;
    } finally {	
        client.release();
    }
    if (res?.rows.length) {
        return {
            userId: res.rows[0].user_id
        }
    }
    return null;
} 

export default updateMatchSettings;