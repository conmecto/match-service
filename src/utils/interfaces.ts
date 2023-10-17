// Generic
interface IGeneric {
    [key: string]: any
}

interface IGenericResponse {
    message: string
}

// Node reqeust object  
interface IRequestObject extends IGeneric {
    body: IGeneric,
    query: IGeneric,
    params: IGeneric,
    method: string,
    path: string,
    headers: IGeneric
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

interface IGetChatsPayload{
    matchId: number,
    userId: number,
    page: number,
    perPage: number,
}
  
export { 
    IGeneric, IRequestObject, IGenericResponse, ICityObject, ICreateSettingObject, IGetMatchObj, ICreateChatRoomObj, 
    IGetSettingObject, IUpdateSettingObj, IChatsResponse, IGetChatsPayload
};