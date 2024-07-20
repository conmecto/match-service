import { QueryResult } from 'pg';
import moment from 'moment';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';

const updateLocationSetting = async (
    userId: number, 
    updateObj: interfaces.IUpdateUserGeohash
) => {
    const updatedAt = moment().toISOString(true);
	const keys = Object.keys(updateObj).map(
        (key, index) => `${enums.FieldsDbName[key]}=$${index+3}`
    ).join(',');
    const query = `
        UPDATE location_setting 
        SET updated_at=$2,${keys}
        WHERE user_id=$1
    `; 
    const params = [userId, updatedAt, ...Object.values(updateObj)];
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

export default updateLocationSetting;