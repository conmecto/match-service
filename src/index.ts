import express, { Express, urlencoded, json } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { parse } from 'url';
import { Environments, constants } from './utils';
import router from './routes';

const app: Express = express();

app.use(json());
app.use(urlencoded());
app.use('/api/v1', router);

const server = createServer(app);
const webSocketServer = new WebSocketServer({ server, maxPayload: constants.SOCKET_MAX_PAYLOAD });

//add webSocketServer on events to a different file
webSocketServer.on('connection', (ws: WebSocket) => {
    ws.on('error', (err) => { console.error(err) }) ;
    ws.on('message', (data) => { console.log(data) });
    ws.send('Hello');
});
webSocketServer.on('error', (err) => {
    console.error(err);
});

server.on('upgrade', (req, socket, head) => {
    const { pathname } = parse(req.url? req.url : '');
    if (pathname === '/api/v1/match/connection') {
        webSocketServer.handleUpgrade(req, socket, head, (ws: WebSocket) => {
            webSocketServer.emit('connection', ws, req);
        });
    } else {
        socket.destroy();
    }
});

server.listen(Environments.server.port, 
    () => console.log(`Server is running on port: ${Environments.server.port}`)
);