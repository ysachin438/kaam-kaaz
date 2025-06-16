import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate { 
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest();
        const token = request.headers['auth_token']?.replace('Bearer ', '');
        console.log('\nExtracted token:', token);
        if (!token) return false
        try {
            const payload = this.jwtService.verify(token)
            request.user = payload
            console.log(payload)
            return true
        } catch (error) {
            console.log('Invalid Token:', error);
            return false
        }
    }
}