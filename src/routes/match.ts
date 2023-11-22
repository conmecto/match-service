import { Request, Response, Router, NextFunction } from 'express';
import { requestUtils, enums } from '../utils'; 
import { 
    getUserMatch, getTopMatches, getUserSettings, updateUserSettings, getPastMatches, getUserChats,
    endMatch, markChatsRead
} from '../controllers';

const matchRouter = Router();

matchRouter.get('/setting/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await getUserSettings(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.put('/setting/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await updateUserSettings(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await getUserMatch(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.get('/top', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await getTopMatches(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.get('/past', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await getPastMatches(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.get('/:matchId/chats', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await getUserChats(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.put('/:matchId/chats/read', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await markChatsRead(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.put('/:matchId/end', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await endMatch(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

export default matchRouter;