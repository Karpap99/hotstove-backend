import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { catchError, Observable, throwError } from "rxjs";

export class ErrorInterceptors implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      catchError((err) =>
        throwError(() => {
          Logger.log(err);
        }),
      ),
    );
  }
}
