import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces } from '../utils';

const addSetting = async (
        createSettingObj: interfaces.ICreateSettingObject, 
        locationSettingObj: interfaces.ICreateLocationSettingObject
    ) => {
    const query1 = `
        INSERT INTO 
        setting(age, gender, max_search_age, min_search_age, search_for, user_id) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING setting.id
    `;
    const params1 = [...Object.keys(createSettingObj).sort().map(key => createSettingObj[key])];
    const query2 = `
        INSERT INTO 
        location_setting(user_id, country) 
        VALUES ($1, $2) RETURNING location_setting.id
    `;
    const params2 = [locationSettingObj.userId, locationSettingObj.country];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        res = await client.query(query1, params1);
        await client.query(query2, params2);
        await client.query('COMMIT');
    } catch(error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {	
        client.release();
    }  
    return Boolean(res?.rowCount);
}

export default addSetting;