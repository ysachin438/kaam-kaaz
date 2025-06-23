import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate { 
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['auth_token']?.replace('Bearer ', '');
        
        if (!token) {
            return false;
        }

        try {
            const payload = this.jwtService.verify(token);
            // Set the user data in request headers
            request.headers['user'] = {
                userId: payload.userId,
                email: payload.email
            };
            return true;
        } catch (error) {
            console.log('Invalid Token:', error);
            return false;
        }
    }
}