import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces } from 'utils';

const addTextGenResponse = async (textGenObj: interfaces.ITextGenObj) => {
    const query1 = `
        INSERT INTO text_gen(user_id, context, response, input_token_count, output_token_count) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING text_gen.id
    `;
    const params1 = [textGenObj.userId, textGenObj.context, textGenObj.response, textGenObj.inputTokenCount, textGenObj.outputTokenCount];
    const query2 = `
        UPDATE text_gen_setting
        SET 
        current = 
        CASE 
            WHEN current < max THEN current + 1
            ELSE MOD(current+1, max)
        END,
        last_reset_at =
        CASE 
            WHEN current=0 THEN NOW()
            WHEN current=3 THEN NOW()
            ELSE last_reset_at
        END
        WHERE user_id=$1
    `;
    const params2 = [textGenObj.userId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        res = await client.query(query1, params1);
        if (!res.rows.length) {
            throw new Error();
        }
        await client.query(query2, params2);
        await client.query('COMMIT');
    } catch(err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {	
        client.release();
    }
    if (res?.rows?.length) {
      return true;
    }
    return false;
}

export default addTextGenResponse;