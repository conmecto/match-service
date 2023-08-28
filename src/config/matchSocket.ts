import { Server, IncomingMessage } from 'http';
import { parse } from 'url';
import { WebSocketServer, WebSocket, Server as SocketServer } from 'ws';
import { constants } from '../utils';

let webSocketServer: SocketServer;
let matchSocketClients = new Map<string, WebSocket>();

const createMatchSocket = async (server: Server) => {
    webSocketServer = new WebSocketServer({ server, maxPayload: constants.SOCKET_MAX_PAYLOAD, path: constants.MATCH_SOCKET_PATH });

    webSocketServer.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        console.log(`Socket server is listening`);
        if (!req?.url) {
            return;
        }
        const parsedReq = parse(req.url, true);
        let userId = parsedReq?.query?.userId;
        if (!userId) {
            return;
        }
        if (matchSocketClients.has(<string>userId)) {
            const userWs = matchSocketClients.get(<string>userId);
            if (userWs) {        
                userWs.send('Hello from old socket');
                return;
            }
        }
        ws.on('message', (data) => { console.log(data.toString()) });
        matchSocketClients.set(<string>userId, ws);
        ws.send('Hello');
        
        ws.on('close', () => {
            matchSocketClients.delete(<string>userId);
            ws.close();
        });
    });

    webSocketServer.on('close', (err) => {
        console.error('socket server is closed');
        matchSocketClients.clear();
    });

    webSocketServer.on('error', (err) => {
        console.error('Socket server error', err);
        matchSocketClients.clear();
    });
    console.log(webSocketServer.clients);
}

export { createMatchSocket, matchSocketClients }
