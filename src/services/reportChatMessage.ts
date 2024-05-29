import moment from 'moment';
import { getDbClient } from '../config';

const reportChatMessage = async (matchId: number, userId: number, chatId: number) => {
	const date = moment().toISOString(true);
    const query = `
        UPDATE chat 
        SET reported=true, reported_by=$2, reported_at=$4 
        WHERE id=$3 AND match_id=$1 AND receiver=$2
    `;
    const params = [matchId, userId, chatId, date];
    const client = await getDbClient();
    try {
        await client.query(query, params);
    } catch(error) {
        throw error;
    } finally {	
        client.release();
    }
} 

export default reportChatMessage;