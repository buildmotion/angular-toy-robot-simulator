import { Component, Input } from '@angular/core';

@Component({
  selector: 'robot-square',
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss',
})
export class SquareComponent {
  @Input() isRobotHere = false; // This property receives a boolean indicating robot presence
  @Input() direction!: string; // This property receives a string indicating the direction the robot is facing
}
