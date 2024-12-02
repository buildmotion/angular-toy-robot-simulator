import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from '@buildmotion/logger';
import { v4 as uuidv4 } from 'uuid';

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
  id: string;

  constructor(private logger: LoggerService) {
    this.id = uuidv4();

    this.logger.log(`ErrorHandler: ${this.id}; Initialized`);
  }

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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  handleError(error: any): void {
    //TODO: Implement a proper error handling mechanism
    //TODO: WRITE TO CLOUD LOGGING SERVICE; DataDog, Loggly, etc.
    this.logger.log(`Logger: ${this.logger.id}; Message: ${error.message}`);
  }
}
