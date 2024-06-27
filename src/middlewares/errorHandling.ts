import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ValidationError, } from 'joi';
import { CustomError, logger } from '../services';
import { enums } from '../utils';

export const errorHandler: ErrorRequestHandler = async (error: any, req: Request, res: Response, next: NextFunction) => {
    let newError: CustomError;
    if (error instanceof CustomError) {
        const errorObj = error.loggingErrorObject;
        await logger('Match Service: ' + 'Error handler: ' + JSON.stringify(errorObj));
        newError = error;
    } else if (error instanceof ValidationError) {
        await logger('Match Service: ' + 'Error handler: ' + error.message);
        newError = new CustomError(enums.StatusCodes.BAD_REQUEST, error.message, enums.ErrorCodes.VALIDATION_ERROR);
    } else {
        await logger('Match Service: ' + 'Error handler: ' + JSON.stringify({
            message: error?.toString(),
            stack: error?.stack 
        }));
        newError = new CustomError(enums.StatusCodes.INTERNAL_SERVER, enums.Errors.INTERNAL_SERVER, enums.ErrorCodes.INTERNAL_SERVER);
    }
    newError.apiPath = req.originalUrl;
    res.status(newError.errorStatus).send(newError.errorObject);
}