import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';

const addSetting = async (createSettingObject: interfaces.ICreateSettingObject): Promise<boolean> => {
    const query = 'INSERT INTO setting(age, city, country, gender, max_search_age, min_search_age, search_for, search_in, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING setting.id';
    const params = [...Object.keys(createSettingObject).sort().map(key => createSettingObject[key])];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
        throw error;
    } finally {	
        client.release();
    }  
    return Boolean(res?.rowCount);
}

export default addSetting;