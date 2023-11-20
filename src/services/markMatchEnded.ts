import { QueryResult } from 'pg';
import moment from 'moment';
import { getDbClient } from '../config';
import { enums, interfaces } from '../utils';

const markMatchEnded = async (matchId: number, userId: number): Promise<interfaces.IEndMatchRes | null> => {
    const query = 'UPDATE match SET ended=true, ended_by=$2, ended_at=$3 WHERE id=$1 AND (user_id_1=$2 OR user_id_2=$2) AND deleted_at IS NULL RETURNING id, user_id_1, user_id_2';
    const params = [matchId, userId, moment().toISOString(true)];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        console.log(query);
        console.log(params);
        res = await client.query(query, params);
    } catch(error) {
        console.error(enums.PrefixesForLogs.DB_END_MATCH_ERROR + error);
        throw error;
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