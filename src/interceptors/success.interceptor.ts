import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';


export class SuccessInterceptors implements NestInterceptor {
 intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
   return handler.handle().pipe(
     map((data) =>
       data.map((item: Object) => {
         return item;
       }),
     ),
   );
 }
}