import { Component } from '@angular/core';
import { LoggerService } from '@buildmotion/logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'toy-robot-ui';

  constructor(private logger: LoggerService) {
    this.logger.log(`AppComponent: constructor with Logger: ${this.logger.id}`);
  }
}
