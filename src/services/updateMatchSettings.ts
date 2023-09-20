import { getDbClient } from '../config';
import { QueryResult } from 'pg';
import { interfaces, enums } from '../utils';

const updateMatchSettings = async (userId: number, updateObj: interfaces.IUpdateSettingObj): Promise<interfaces.IGetSettingObject | null> => {
	const splitQuery = ['UPDATE setting SET ']; 
    const params = [userId];
    const size = Object.keys(updateObj).length;
    let i = 2;
    for(const key in updateObj) {
        if (i-1 === size) {
            splitQuery.push(`${enums.SettingFieldsDbName[key]}=$${i} `);
        } else {
            splitQuery.push(`${enums.SettingFieldsDbName[key]}=$${i}, `);
        }
        params.push(updateObj[key]);
        i += 1;
    }
    splitQuery.push('WHERE user_id=$1 RETURNING setting.id, setting.user_id, setting.search_for, setting.search_in, setting.min_search_age, setting.max_search_age, setting.is_matched, setting.current_queue');
    const query = splitQuery.join('');
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        console.log(query);
        console.log(params);
        res = await client.query(query, params);
    } catch(error) {
        console.error(enums.PrefixesForLogs.DB_UPDATE_MATCH_SETTINGS_ERROR + error);
        throw error;
    } finally {	
        client.release();
    }
    if (res.rows.length) {
        console.log(res.rows[0])
        const settingObj: Record<string, any> = {};
        for(const key in res.rows[0]) {
            settingObj[enums.SettingFieldsDbName[key]] = res.rows[0][key];
        }
        return <interfaces.IGetSettingObject>settingObj;
    }
    return null;
} 

export default updateMatchSettings;