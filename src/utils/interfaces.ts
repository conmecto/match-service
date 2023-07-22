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
}

export { 
    IGeneric, IRequestObject, IGenericResponse, ICityObject, ICreateSettingObject
};