import { Response } from 'express';
import { StatusCode } from '../enums';

export const sendResponse = <T>(res: Response, statusCode: StatusCode | number, success: boolean, data?: T, error?: string) => {
    const payload: Record<string, unknown> = { success };
    if (data !== undefined) payload.data = data;
    if (error !== undefined) payload.error = error;
    
    return res.status(statusCode).json(payload);
};
