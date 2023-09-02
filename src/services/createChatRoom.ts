import { QueryResult } from 'pg';
import { getDbClient } from '../config';
import { interfaces, enums } from '../utils';

const createChatRoom = async (createChatRoomObj: interfaces.ICreateChatRoomObj) => {
    const query = 'INSERT INTO chat_room(match_id, user_id_1, user_id_2) VALUES ($1, $2, $3)';
    const { matchId, userId1, userId2 } = createChatRoomObj;
    const params = [matchId, userId1, userId2];
    let res: QueryResult | null = null;
    const client = await getDbClient();
    try {
        console.log(query);
        console.log(params);
        res = await client.query(query, params);
    } catch(error) {
        console.error(enums.PrefixesForLogs.DB_CREATE_CHAT_ROOM_ERROR + error);
        throw error;
    } finally {	
        client.release();
    }
} 

export default createChatRoom;