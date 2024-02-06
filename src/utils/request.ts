import { ICustomerRequest, IRequestObject } from './interfaces';

const filterRequest = async (req: ICustomerRequest): Promise<IRequestObject> => {
    const httpRequest: IRequestObject = {
        body: req.body,
        path: req.path,
        params: req.params,
        query: req.query,
        method: req.method,
        headers: req.headers,
        user: req.user
    };
    return httpRequest;
}

export { filterRequest };