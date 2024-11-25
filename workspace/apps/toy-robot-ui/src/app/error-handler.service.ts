import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  constructor() {}

  handleError(error: any): void {
    //TODO: Implement a proper error handling mechanism
    //TODO: WRITE TO CLOUD LOGGING SERVICE; DataDog, Loggly, etc.
    console.error(error);
  }
}
