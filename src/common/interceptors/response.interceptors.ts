import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonResponse } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, CommonResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<CommonResponse<T>> {
        const request = context.switchToHttp().getRequest();
        return next.handle().pipe(
            map((data) => {
                console.log(data, "response Interceptor");
                let code = data.code ?? 200;
                let message = data.message ?? 'Request successful';
                data = data.data ?? {};
                // if (request.method === 'POST') {
                //     code = 201;
                //     message = 'Resource created successfully';
                // }

                return { code, message, data };
            }),
        );
    }
}
