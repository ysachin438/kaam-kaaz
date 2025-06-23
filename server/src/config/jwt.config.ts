import { ConfigService } from "@nestjs/config";

export const JWT_SECRET = process.env.JWT_SECRET || '';

export const jwtConfig = (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET') || JWT_SECRET,
    signOptions: {
        expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
    },
}); 