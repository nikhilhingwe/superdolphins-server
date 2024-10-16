

 export type THTTPResponse = {
    success: boolean,
    status: number,
    request: {
        ip?: string | null,
        method: string,
        url: string,
    }
    message: string,
    data: unknown
 }

 export type THTTPError = {
    success: boolean,
    status: number,
    request: {
        ip?: string | null,
        method: string,
        url: string,
    }
    message: string,
    data: unknown
    trace?: object | null 
 }