import { Request } from 'express'
import { THTTPError } from '../types/types'
import responseMessage from '../constants/responseMessage'
import { EApplicationEnvironment } from '../constants/application'
import config from '../config/config'

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (err: Error | unknown, req: Request, errorStatusCode: number = 500): THTTPError => {
    const errorObj: THTTPError = {
        success: false,
        status: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG,
        data: null,
        trace: err instanceof Error ? { error: err.stack } : null
    }

    // eslint-disable-next-line no-console
    console.info('Controller_ERROR', {
        meta: errorObj
    })

    if (config.ENV === EApplicationEnvironment.PRODUCTION) {
        delete errorObj.request.ip
        delete errorObj.trace
    }

    return errorObj
}
