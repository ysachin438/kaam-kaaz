import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import {NextFunction, Request, Response} from 'express'
import { verifyToken } from '../utils/jwt.util'

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    use(req: Request, res:Response, next: NextFunction){
        try {
            const authHeader = req.headers.auth_token as string
            if (!authHeader) {
                throw new UnauthorizedException('No auth token provided')
            }

            // Remove 'Bearer ' prefix if present
            const token = authHeader.replace('Bearer ', '')
            
            const decoded = verifyToken(token)
            if (!decoded) {
                throw new UnauthorizedException('Invalid token')
            }

            // Add decoded user info to request for use in controllers
            (req as any).user = decoded
            
            next()
        } catch (error) {
            throw new UnauthorizedException(error.message)
        }
    }
}

export class secondMiddleware implements NestMiddleware{
   use(req: Request, res:Response, next: NextFunction){
        console.log('Hi I am Second Middleware')
        if(1){
            console.log('Owoow')
        }
        next()
    }
}