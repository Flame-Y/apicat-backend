import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log(context.switchToHttp().getRequest().url);
        //TODO:处理mock接口返回的数据
        return next.handle().pipe(
            map((data) => {
                return {
                    code: 200,
                    message: 'success',
                    data
                };
            })
        );
    }
}
