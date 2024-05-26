import { QueryResult } from 'pg';
import moment from 'moment';
import { getDbClient } from '../config';
import { enums, interfaces } from '../utils';

const markMatchEnded = async (matchId: number, userId: number, block: boolean): Promise<interfaces.IEndMatchRes | null> => {
    const query1 = `
        UPDATE match 
        SET ended=true, ended_by=$2, ended_at=$3 
        WHERE id=$1 AND (user_id_1=$2 OR user_id_2=$2) AND deleted_at IS NULL 
        RETURNING id, user_id_1, user_id_2
    `;
    const params1 = [matchId, userId, moment().toISOString(true)];
    const query2 = `
        UPDATE setting 
        SET active_matches_count=active_matches_count-1
        WHERE (user_id=$1 OR user_id=$2) AND deleted_at IS NULL
    `;
    const params2 = [userId];
    const query3 = 'INSERT INTO match_block(user_id_1, user_id_2) VALUES ($1, $2) RETURNING match_block.id';
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        await client.query('BEGIN');
        res = await client.query(query1, params1);
        if (!res.rows.length) {
            throw new Error();
        }
        const match = res.rows[0];
        const otherUserId = match.user_id_1 === userId ? match.user_id_2 : match.user_id_1;
        params2.push(otherUserId);
        await client.query(query2, params2);
        if (block) {
            await client.query(query3, params2);
        }
        await client.query('COMMIT');
    } catch(error) {
        await client.query('ROLLBACK');
    } finally {	
        client.release();
    }
    if (res?.rows?.length) {
        const match = res.rows[0];
        return {
            id: match.id,
            userId1: match.user_id_1,
            userId2: match.user_id_2
        }
    }
    return null;
}

export default markMatchEnded;