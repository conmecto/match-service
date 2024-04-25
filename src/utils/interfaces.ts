import { Request } from 'express';

// Generic
interface IGeneric {
    [key: string]: any
}

interface IGenericResponse {
    message: string
}

// Node request object  
interface ICustomerRequest extends Request {
    user?: Record<string, any>
}

interface IRequestObject extends IGeneric {
    body: IGeneric,
    query: IGeneric,
    params: IGeneric,
    method: string,
    path: string,
    headers: IGeneric,
    file?: IGeneric
}

//BaseModel
interface IBaseModel {
    id: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
}

// City 
interface ICityObject {
    id?: number,
    city: string,
    country?: string
}

//Setting
interface ICreateSettingObject {
    userId: number,
    age: number,
    city: string,
    country: string, 
    searchFor: string,
    searchIn: string,
    gender: string,
    minSearchAge: number,
    maxSearchAge: number
}

interface IGetSettingObject {
    id: number,
    userId: number,
    age?: number,
    city?: string,
    country?: string, 
    searchFor: string,
    searchIn: string,
    gender?: string,
    minSearchAge: number,
    maxSearchAge: number,
    currentQueue?: number,
    isMatched?: boolean
}

//Match
interface IGetMatchObj {
    id: number,
    userId1: number,
    userId2: number,
    score: number,
    createdAt: Date,
    city?: string,
    country?: string,
}

interface IGetMatchObjWithSetting {
    id?: number,
    userId1?: number,
    userId2?: number,
    score?: number,
    createdAt?: Date,
    city?: string,
    country?: string,
    settingId: number,
    userId: number,
    totalMatchScore: number,
    pinnedPostId?: number
}

//Chat Room 
interface ICreateChatRoomObj {
    matchId: number,
    userId1: number,
    userId2: number
}

interface IUpdateSettingObj {
    minSearchAge?: number,
    maxSearchAge?: number,
    searchFor?: string,
    searchIn?: string, 
}

interface IChatsResponse {
    id: number,
    sender: number,
    receiver: number,
    matchId: number,
    type: string,
    message: string,
    location?: string,
    fileMetadataId?: number,
    seen: boolean,
    seenAt?: Date,
    createdAt: Date,
    deletedAt: Date
}

interface IGetChatsPayload {
    matchId: number,
    userId: number,
    page: number,
    perPage: number,
}

interface IEndMatchRes {
    id: number,
    userId1: number,
    userId2: number
}

//Auth Middleware

interface ITokenVerifyResponse {
    userId: number,
    extension: string,
    number: string,
    jti: string;
    exp: number;
    iss?: string;
    sub?: string;
    aud?: string | string[];
    nbf?: number;
    iat?: number;
}

interface IGenerateUploadUrlBody { 
    matchId: number, 
    userId: number, 
    fileName: string, 
    contentType: string 
}
  
export { 
    IGeneric, IRequestObject, IGenericResponse, ICityObject, ICreateSettingObject, IGetMatchObj, ICreateChatRoomObj, 
    IGetSettingObject, IUpdateSettingObj, IChatsResponse, IGetChatsPayload, IEndMatchRes, ITokenVerifyResponse,
    ICustomerRequest, IGetMatchObjWithSetting, IGenerateUploadUrlBody
};