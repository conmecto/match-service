import express, { Express, urlencoded, json } from 'express';
import { createServer, Server } from 'http';
import { createServer as createSecureServer, Server as SecureServer } from 'https';
import { readFileSync } from 'fs';
import { Environments } from './utils';
import router from './routes';
import { errorHandler } from './middlewares/errorHandling';
import { createChatSocket } from './config'

const app: Express = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use('/v1', router, errorHandler);

let server: Server | SecureServer | null = null;

if (Environments.secure) {
    const options = {
        key: readFileSync('./key.pem'),
        cert: readFileSync('./cert.pem')
    };
    server = createSecureServer(options, app);
} else {
    server = createServer(app);
}

createChatSocket(server);

server.listen(Environments.server.port, 
    () => console.log(`Server is running on port: ${Environments.server.port}`)
);