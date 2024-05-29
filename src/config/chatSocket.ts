import { Server, IncomingMessage } from 'http';
import { parse } from 'url';
import { omit } from 'lodash';
import { WebSocketServer, WebSocket, Server as SocketServer } from 'ws';
import { constants, enums, Environments, helpers } from '../utils';
import { getMatchById, logger } from '../services';
import { redisClient1 as pubClient } from './redis';
import { verifyAuthToken } from '../middlewares';

type savedClient = { userId: number, matchedUserId: number, ws: WebSocket, matchId: number };

let webSocketServer: SocketServer;
let chatSocketClients = new Map<string, savedClient>();

const getChatSocketKey = helpers.getChatSocketKey;

const clearChatSocketClient = (matchId: string, userId: string) => {
    chatSocketClients.delete(getChatSocketKey(matchId, userId));
}

const setSocketWithMatchedUser = async (matchId: string, userId: string, ws: WebSocket) => {
    const match = await getMatchById(Number(matchId));
    const userIdNumeric = Number(userId);
    if (!match || (match.userId1 !== userIdNumeric && match.userId2 !== userIdNumeric)) {
        return;
    }
    const matchedUserId = match.userId1 === userIdNumeric ? match.userId2 : match.userId1;
    chatSocketClients.set(getChatSocketKey(matchId, userId), { userId: userIdNumeric, matchedUserId, ws, matchId: match.id });
}

const verifyClient = (info, callback) => {
    const req = info.req;
    const parsedReq = parse(req?.url, true);
    const userId = <string>parsedReq?.query?.userId;
    const accessToken: string = <string>parsedReq?.query?.accessToken;
    if (userId && accessToken) {
        verifyAuthToken(accessToken).then(res => {
            callback(res.userId === Number(userId));
        }).catch((error) => {
            logger(`Match Service: Chat Verify Token Error UserId ${userId}: ` + error?.toString());
            callback(false);
        });
    } else {    
        callback(false);
    }
}

const createChatSocket = async (server: Server) => {
    webSocketServer = new WebSocketServer({ server, maxPayload: constants.SOCKET_MAX_PAYLOAD, path: constants.CHAT_SOCKET_PATH, verifyClient });
    webSocketServer.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        const parsedReq = parse(req.url as string, true);
        const userId = <string>parsedReq?.query?.userId;
        const matchId = <string>parsedReq?.query?.matchId;
        const chatSocketKey = getChatSocketKey(matchId, userId);
        if (!chatSocketClients.has(chatSocketKey)) {
            setSocketWithMatchedUser(matchId, userId, ws);
        }

        ws.on('message', (data) => {
            const parsedData: Record<string, any> = JSON.parse(data?.toString());
            const event = parsedData?.event;
            const message = parsedData?.message;
            const { matchedUserId } = chatSocketClients.get(chatSocketKey) as savedClient;

            if (event === enums.ChatSocketEvents.SAVE_MESSAGE) {
                pubClient.publish(Environments.redis.channels.saveMessage, Buffer.from(
                    JSON.stringify({
                        message, 
                        userId,
                        matchedUserId, 
                        matchId,
                        event
                    })
                ));
                const matchedUserChatSocketKey = getChatSocketKey(matchId?.toString(), matchedUserId?.toString());
                if (chatSocketClients.has(matchedUserChatSocketKey)) {
                    const { ws: receiverSocket } = <savedClient>chatSocketClients.get(matchedUserChatSocketKey);
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
                            logger('Chat message send socket error: ' + error?.toString());
                        }
                    });
                }
            } else if (event === enums.ChatSocketEvents.SAVE_FILE) {
                const fileData = omit(parsedData, ['event', 'message', 'matchId', 'userId', 'matchedUserId']);
                fileData.bucket = Environments.aws.s3BucketChat;
                pubClient.publish(Environments.redis.channels.saveMessage, Buffer.from(
                    JSON.stringify({
                        message, 
                        userId,
                        matchedUserId, 
                        matchId,
                        event,
                        fileData
                    })
                ));
                const matchedUserChatSocketKey = getChatSocketKey(matchId?.toString(), matchedUserId?.toString());
                if (chatSocketClients.has(matchedUserChatSocketKey)) {
                    const { ws: receiverSocket } = <savedClient>chatSocketClients.get(matchedUserChatSocketKey);
                    receiverSocket.send(JSON.stringify({ 
                        event: enums.ChatSocketEvents.MESSAGE_RECEIVED,
                        sender: userId, 
                        receiver: matchedUserId, 
                        matchId,
                        type: 'image',
                        message,
                        createdAt: new Date(), 
                        updatedAt: new Date(), 
                        deletedAt: null,
                        seen: false,
                        location: fileData.location,
                        name: fileData.name,
                        mimetype: fileData.mimetype,
                        size: fileData.size, 
                        height: fileData.height,
                        width: fileData.width
                    }), (error) => {
                        if (error) {
                            logger('Chat message send socket error: ' + error?.toString());
                        }
                    });
                }
            } else if (event === enums.ChatSocketEvents.MARK_MESSAGES_AS_READ) {
                //using api for now but this can be used for real time message read update   
            } 
        });
        
        ws.on('close', () => {
            chatSocketClients.delete(chatSocketKey);
            ws.close();
        });

        ws.on('error', (error) => {
            logger('Match Service: Chat socket error: ' + error?.toString());
            chatSocketClients.delete(chatSocketKey);
            ws.close();
        });
    });

    webSocketServer.on('close', () => {
        logger('Match Service: Socket server is closed');
        chatSocketClients.clear();
    });

    webSocketServer.on('error', (error) => {
        logger('Match Service: Socket server error: ' + error?.toString());
        chatSocketClients.clear();
    });
}

export { createChatSocket, chatSocketClients, clearChatSocketClient }
