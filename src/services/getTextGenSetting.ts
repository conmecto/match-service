import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { helpers, interfaces } from '../utils';

const getTextGenSetting = async (userId: number) => {
    const query = `
        SELECT current, max, last_reset_at
        FROM text_gen_setting
        WHERE user_id=$1 AND deleted_at IS NULL
    `;
    const params = [userId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(err) {
        throw err;
    } finally {	
        client.release();
    }
    if (res?.rows?.length) {
      return helpers.formatDbQueryResponse<interfaces.ITextGenSettingObj>(res.rows[0]);
    }
}

export default getTextGenSetting;