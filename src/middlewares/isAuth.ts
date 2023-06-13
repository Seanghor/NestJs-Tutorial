import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { jwt } from 'jsonwebtoken';
import { TokenPayload } from '../utils/dto/util.dto';

@Injectable()
export class IsAuthService implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            // const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                res.status(401)
                throw new Error('🚫 Un-Authorized 🚫')
            }

            const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as TokenPayload;
            req.payload = payload;
        } catch (error) {
            res.status(401)
            if (error.name === 'TokenExpiredError') {
                throw new Error(error.name);
            }
            throw new Error('🚫 Un-Authorized 🚫');
        }
        return next();
    }

}
