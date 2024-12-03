import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'any',
})
export class LoggerService {
  id: string;

  constructor() {
    this.id = uuidv4();

    this.log(`Logger: ${this.id}; Initialized`);
  }

  log(message: string): void {
    console.log(message);
  }
}
