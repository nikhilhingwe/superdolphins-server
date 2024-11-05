// src/@types/express.d.ts

import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            files?: {
                [fieldname: string]: express.Multer.File[];
            };
        }
    }
}