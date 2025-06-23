import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/jwt.config';

export interface TokenPayload {
    userId: string;
    email: string;
}

export const generateToken = (payload: TokenPayload): string => {
    return sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
};
