import { Injectable, NestMiddleware, UnauthorizedException, UseFilters } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import  {verify}  from 'jsonwebtoken';
import { TokenPayload } from '../utils/dto/util.dto';
import { HttpExceptionFilter, UnauthorizedExceptionFilter } from 'src/model/http-exception.filter';

@Injectable()
@UseFilters(UnauthorizedExceptionFilter)
export class IsAuthService  implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        try {
            // const token = req.headers.authorization.split(' ')[1];
            const token = req.header('Authorization')?.replace('Bearer ', '');
            console.log("Token:",token);
            
            if (!token || token === null || token === 'Bearer') {
                res.status(401)
                throw new UnauthorizedException('🚫 Invalid Token 🚫')
            }

            const payload = verify(token, process.env.JWT_ACCESS_SECRET) as TokenPayload;
            req.payload = payload;
        
        } catch (error) {
            // res.status(401)
            console.log("Error:", error);
            
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Expired Token');
                // throw new UnauthorizedException(error.name);
            }
            // throw new UnauthorizedException('🚫 Un-Authorized 🚫');
            throw new UnauthorizedException(error.message);
        }
        return next();
    }

}
