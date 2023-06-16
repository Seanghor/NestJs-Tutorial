import { TokenPayload } from "../../utils/dto/util.dto";
import { Request, Response, NextFunction } from 'express';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            payload: TokenPayload;
        }
    }
}