import { Injectable, NestMiddleware } from '@nestjs/common'
import {NextFunction, Request, Response} from 'express'

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    use(req: Request, res:Response, next: ()=> void){
        const token = req.headers.auth_token ?? ""
        if(token){
            // if(verifyToken(token)) next();
        }
        return ({message: "Unauthorized Access", status: "404"})
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