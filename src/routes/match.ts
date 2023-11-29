import { Request, Response, Router, NextFunction } from 'express';
import { requestUtils, enums } from '../utils'; 
import { 
    getUserMatch, getTopMatches, getUserSettings, updateUserSettings, getPastMatches, getUserChats,
    endMatch, markChatsRead
} from '../controllers';
import { authenticateRequest } from '../middlewares';

const matchRouter = Router();

matchRouter.get('/setting/:userId', authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await getUserSettings(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.put('/setting/:userId', authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await updateUserSettings(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.get('/users/:id', authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await getUserMatch(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.get('/top', authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await getTopMatches(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.get('/past', authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await getPastMatches(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.get('/:matchId/chats', authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await getUserChats(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.put('/:matchId/chats/read', authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await markChatsRead(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

matchRouter.put('/:matchId/end', authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await endMatch(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

export default matchRouter;