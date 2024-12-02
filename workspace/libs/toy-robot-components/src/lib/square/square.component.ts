import { Component, Input } from '@angular/core';
import { LoggerService } from '@buildmotion/logger';

@Component({
  selector: 'robot-square',
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss',
  providers: [LoggerService],
})
export class SquareComponent {
  @Input() isRobotHere = false; // This property receives a boolean indicating robot presence
  @Input() direction!: string; // This property receives a string indicating the direction the robot is facing

  constructor(private logger: LoggerService) {
    this.logger.log('SquareComponent: Initialized with Logger: ' + this.logger.id);
  }
}
