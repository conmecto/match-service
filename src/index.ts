import express, { Express, urlencoded, json } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { Environments, constants } from './utils';
import router from './routes';
import { errorHandler } from './middlewares/errorHandling';

const app: Express = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use('/v1', router, errorHandler);

const server = createServer(app)

const webSocketServer = new WebSocketServer({ server, maxPayload: constants.SOCKET_MAX_PAYLOAD, path: '/v1/socket-server' });

webSocketServer.on('connection', (ws: WebSocket) => {
    console.log(`Socket server is listening`);
    ws.on('error', (err) => { console.error(err) }) ;
    ws.on('message', (data) => { console.log(data.toString()) });
    ws.send('Hello');
});

webSocketServer.on('error', (err) => {
    console.error(err);
});

server.listen(Environments.server.port, 
    () => console.log(`Server is running on port: ${Environments.server.port}`)
);