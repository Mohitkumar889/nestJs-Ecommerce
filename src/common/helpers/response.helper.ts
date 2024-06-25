import { CommonResponse } from '../interfaces/response.interface';

export function createResponse<T>(
    code: number,
    message: string,
    data: T,
): CommonResponse<T> {
    return { code, message, data };
}