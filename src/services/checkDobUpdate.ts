import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { enums } from '../utils';
import CustomError from './customError'

const checkDobUpdate = async (userId: number) => {
    const query = 'SELECT dob FROM setting WHERE user_id=$1 AND deleted_at IS NULL';
    const params = [userId];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        res = await client.query(query, params);
    } catch(error) {
        throw error;
    } finally {	
        client.release();
    }
    if (res.rows.length && res.rows[0].dob) {
        throw new CustomError(
            enums.StatusCodes.FORBIDDEN, 
            enums.Errors.FORBIDDEN, 
            enums.ErrorCodes.FORBIDDEN
        );  
    }
}

export default checkDobUpdate;