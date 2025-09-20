import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { error } from "console";
import { catchError, map, Observable, throwError } from "rxjs";

export class ErrorInterceptors implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      catchError((err) =>
        throwError(() => {
          err;
        }),
      ),
    );
  }
}
