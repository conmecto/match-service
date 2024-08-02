import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces, helpers } from '../utils';

const getGenMessages = async (userId: number, page: number) => {
    const query = `
        WITH total_count AS (
            SELECT count(*) AS count 
            FROM text_gen 
            WHERE user_id=$1 AND response IS NOT NULL AND deleted_at IS NULL
        ),
        paginated_results AS (
            SELECT id, context, response, (SELECT count > $4 FROM total_count) AS has_more
            FROM text_gen
            WHERE user_id=$1 AND response IS NOT NULL AND deleted_at IS NULL 
            ORDER BY created_at DESC 
            OFFSET $2
            LIMIT $3
        )
        SELECT * FROM paginated_results
    `;
    const perPage = 3;
    const skip = (page - 1) * perPage;
    const countSkip = page * perPage;
    const params = [userId, skip, perPage, countSkip];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
        throw error;
    } finally {	
        client.release();
    }
    return res?.rows?.length ? res.rows.map(message => {
        return helpers.formatDbQueryResponse<interfaces.ITextGenResponseObj>(message);
    }) : [];
}

export default getGenMessages;