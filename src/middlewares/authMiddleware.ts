import { verify } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { interfaces, enums, Environments } from '../utils';
import { CustomError, cacheClient } from '../services';

const verifyAuthToken = async (token: string): Promise<interfaces.ITokenVerifyResponse> => {
    const payload: interfaces.ITokenVerifyResponse = await new Promise((resolve, reject) => {
        const key = Buffer.from(Environments.token.publicKey, 'base64').toString('ascii');
        verify(token, key, (err, payload) => {
            if (!err && !payload) {
                reject(new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER));
            } else if (err && err.name === 'JsonWebTokenError') {
                reject(new CustomError(enums.StatusCodes.INVALID_TOKEN, enums.Errors.TOKEN_INVALID, enums.ErrorCodes.TOKEN_INVALID));
            } else if (err && err.name === 'TokenExpiredError') { 
                reject(new CustomError(enums.StatusCodes.UNAUTHORIZED, enums.Errors.TOKEN_EXPIRED, enums.ErrorCodes.TOKEN_EXPIRED));
            } else {
                resolve(<interfaces.ITokenVerifyResponse>payload);
            }
        });
    });
    return payload;
}

const authenticateRequest = async (req: interfaces.IRequestObject, res: Response, next: NextFunction) => {
    try { 
        let accessToken: string = req.headers['authorization'];
        if (!accessToken) {
            throw new CustomError(enums.StatusCodes.FORBIDDEN, enums.Errors.FORBIDDEN, enums.ErrorCodes.FORBIDDEN);
        }
        const payload = await verifyAuthToken(accessToken.replace('Bearer ', ''));
        const userCache = await cacheClient.getKey(`user:${payload.userId}`);
        if (!userCache) {
            throw new CustomError(enums.StatusCodes.INVALID_TOKEN, enums.Errors.TOKEN_INVALID, enums.ErrorCodes.TOKEN_INVALID)
        }
        req.user = { userId: payload.userId };
        next();
    } catch (error) {
        next(error);
    }
}

export { authenticateRequest, verifyAuthToken };