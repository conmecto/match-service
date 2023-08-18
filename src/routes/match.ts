import { Request, Response, Router, NextFunction } from 'express';
import { requestUtils, enums } from '../utils'; 
import { getUserMatch } from '../controllers';

const matchRouter = Router();

matchRouter.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filterRequest = await requestUtils.filterRequest(req);
        const controllerResponse = await getUserMatch(filterRequest);
        res.status(enums.StatusCodes.OK).send(controllerResponse);    
    } catch(err) {
        next(err);
    }
});

export default matchRouter;