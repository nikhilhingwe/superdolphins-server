import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constants/responseMessage'
import httpError from '../util/httpError'

export default {
    self: (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    }
}
