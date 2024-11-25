import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
/**
 * Service that implements the `ErrorHandler` interface to handle errors in the application.
 *
 * @remarks
 * This service currently logs errors to the console. Future implementations should include
 * a proper error handling mechanism and write the error details to a cloud logging service
 * such as DataDog or Loggly.
 *
 * @example
 * ```typescript
 * import { ErrorHandlerService } from './error-handler.service';
 *
 * @NgModule({
 *   providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
 * })
 * export class AppModule {}
 * ```
 */
export class ErrorHandlerService implements ErrorHandler {
  /**
   * Handles errors by logging them to the console.
   *
   * @param error - The error object to be handled.
   *
   * @remarks
   * This method currently logs the error to the console.
   * Future implementations should include a proper error handling mechanism
   * and write the error details to a cloud logging service such as DataDog or Loggly.
   */
  handleError(error: any): void {
    //TODO: Implement a proper error handling mechanism
    //TODO: WRITE TO CLOUD LOGGING SERVICE; DataDog, Loggly, etc.
    console.error(error);
  }
}
