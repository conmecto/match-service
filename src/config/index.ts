import { redisClient1, redisClient2 } from './redis';
import getDbClient from './database';
import { createMatchSocket, matchSocketClients } from './matchSocket';

export {
    redisClient1, redisClient2, getDbClient, createMatchSocket, matchSocketClients
}