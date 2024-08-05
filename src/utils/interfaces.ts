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

//Match
interface IGetMatchObj {
    id: number,
    userId1: number,
    userId2: number,
    score: number,
    createdAt: Date,
    country?: string,
}

interface IGetMatchDbResponse {
    id: number,
    userId1: number,
    userId2: number,
    score: number,
    createdAt: Date,
    country: string,
    chatId?: number,
    user1MatchSeenAt?: Date,
    user2MatchSeenAt?: Date
}

interface IGetMatchListObj extends IGetMatchDbResponse {
    chatNotification: boolean
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
}

interface IUpdateLocationSetting {
    searchArea?: string
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
    deletedAt: Date,
    hasMore: boolean
}

interface IGetChatsPayload {
    matchId: number,
    userId: number,
    page: number,
    skip: number,
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

interface IUserMatchSummaryObj {
    id: number,
    matchId: number,
    userId: number,
    activeMatchesCount: number,
    totalMatchScore: number,
    matchDurationHours: number,
    score: number
}
  
interface IGetUserMatchSettingObject {
    id: number,
    userId: number,
    searchFor: string,
    minSearchAge: number,
    maxSearchAge: number,
    searchArea: string,
    geohash?: string,
    country: string
}

interface IUpdateUserGeohash {
    lat: number,
    long: number,
    geohash: string,
}

interface IUpdateUserGeohashCache extends IUpdateUserGeohash {
    userId: number
}

interface ITextGenObj {
    userId: number,
    context: string, 
    response: string, 
    inputTokenCount: number, 
    outputTokenCount: number
}

interface ITextGenSettingObj {
    current: number,
    max: number, 
    lastResetAt: Date,
    isWaitingPeriod: boolean
}

interface ITextGenResponseObj {
    id: number,
    context: string, 
    response: string,
    hasMore: boolean
}

export { 
    IGeneric, IRequestObject, IGenericResponse, ICityObject, IGetMatchObj, ICreateChatRoomObj, 
    IUpdateSettingObj, IChatsResponse, IGetChatsPayload, IEndMatchRes, ITokenVerifyResponse,
    ICustomerRequest, IGetMatchDbResponse, IGenerateUploadUrlBody, IUserMatchSummaryObj, IGetUserMatchSettingObject,
    IUpdateLocationSetting, IUpdateUserGeohash, IUpdateUserGeohashCache, IGetMatchListObj,
    ITextGenObj, ITextGenSettingObj, ITextGenResponseObj
};