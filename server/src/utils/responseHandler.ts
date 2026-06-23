import { Response } from 'express';

export const sendResponse = (res: Response, statusCode: number, success: boolean, data?: any, error?: string) => {
    const payload: any = { success };
    if (data !== undefined) payload.data = data;
    if (error !== undefined) payload.error = error;
    
    return res.status(statusCode).json(payload);
};
