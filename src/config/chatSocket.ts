import { Server, IncomingMessage } from 'http';
import { parse } from 'url';
import { WebSocketServer, WebSocket, Server as SocketServer } from 'ws';
import { constants, enums, Environments } from '../utils';
import { getUserLatestMatch } from '../services';
import { redisClient1 as pubClient } from './redis';

type savedClient = { matchedUserId: number, ws: WebSocket, matchId: number };

let webSocketServer: SocketServer;
let chatSocketClients = new Map<string, savedClient>();

const clearChatSocketClient = (userId: string) => {
    chatSocketClients.delete(userId);
}

const setSocketWithMatchedUser = async (userId: string, ws: WebSocket) => {
    const match = await getUserLatestMatch(Number(userId));
    if (!match) {
        return;
    }
    const matchedUserId = match.userId1 === Number(userId) ? match.userId2 : match.userId1;
    chatSocketClients.set(userId, { matchedUserId, ws, matchId: match.id });
    console.log('New socket saved for user: ', userId);
}

const createChatSocket = async (server: Server) => {
    webSocketServer = new WebSocketServer({ server, maxPayload: constants.SOCKET_MAX_PAYLOAD, path: constants.CHAT_SOCKET_PATH });
    webSocketServer.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        console.log(`Socket server is listening`);
        if (!req?.url) {
            return;
        }
        const parsedReq = parse(req.url, true);
        let userId = <string>parsedReq?.query?.userId;
        if (!userId) {
            return;
        }
        if (chatSocketClients.has(userId)) {
            console.log('Old socket found for user: ', userId);
        } else {
            setSocketWithMatchedUser(userId, ws);
        }
        
        ws.on('message', (data) => {
            const { message, event }: { message: string, event: string } = JSON.parse(data?.toString());
            const { matchedUserId, ws, matchId } = <savedClient>chatSocketClients.get(userId);
            if (event === enums.ChatSocketEvents.SAVE_MESSAGE) {
                pubClient.publish(Environments.redis.channels.saveMessage, Buffer.from(
                    JSON.stringify({
                        message, 
                        userId,
                        matchedUserId, 
                        matchId
                    })
                ));
                if (chatSocketClients.has(matchedUserId?.toString())) {
                    const { ws: receiverSocket } = <savedClient>chatSocketClients.get(matchedUserId?.toString());
                    receiverSocket.send(JSON.stringify({ 
                        event: enums.ChatSocketEvents.MESSAGE_RECEIVED,
                        sender: userId, 
                        receiver: matchedUserId, 
                        matchId,
                        type: 'text',
                        message,
                        createdAt: new Date(), 
                        updatedAt: new Date(), 
                        deletedAt: null,
                        seen: false
                    }), (error) => {
                        if (error) {
                            console.log('Chat message send socket error:', error);
                        }
                    });
                }
            } else if (event === enums.ChatSocketEvents.MARK_MESSAGES_AS_READ) {
                //using api for now but this can be used for real time message read update   
            } 
        });
        
        ws.on('close', () => {
            chatSocketClients.delete(<string>userId);
            ws.close();
        });

        ws.on('error', (error) => {
            console.log('Chat socket error: ', error);
            chatSocketClients.delete(<string>userId);
            ws.close();
        });
    });

    webSocketServer.on('close', () => {
        console.error('socket server is closed');
        chatSocketClients.clear();
    });

    webSocketServer.on('error', (error) => {
        console.error('Socket server error', error);
        chatSocketClients.clear();
    });
}

export { createChatSocket, chatSocketClients, clearChatSocketClient }
