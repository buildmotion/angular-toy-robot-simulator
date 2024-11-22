import { Component, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';

type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

// Ordered directions for circular rotation
const DIRECTIONS: Direction[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

// Moves mapped to directions
const MOVES = {
  NORTH: { x: 0, y: 1 },
  EAST: { x: 1, y: 0 },
  SOUTH: { x: 0, y: -1 },
  WEST: { x: -1, y: 0 },
} as const;

@Component({
  selector: 'robot-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  messages!: Message[];
  robotPosition!: { x: number; y: number; f: Direction };
  grid!: any[][];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.grid = Array.from({ length: 5 }, (_, rowIndex) =>
      Array.from({ length: 5 }, (_, colIndex) => ({ rowIndex, colIndex }))
    );
  }

  isValidCell(x: number, y: number): boolean {
    return x >= 0 && x <= 4 && y >= 0 && y <= 4;
  }

  placeRobot(x: number, y: number) {
    if (this.isValidCell(x, y)) {
      this.robotPosition = { x, y, f: 'NORTH' };
      this.showTemporaryMessage(
        'success',
        'Robot Placed',
        `Placed at: ${x},${y}`
      );
    }
  }

  private showTemporaryMessage(
    severity: 'success' | 'error',
    summary: string,
    detail: string
  ) {
    this.messageService.add({ severity, summary, detail });
    setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }

  getRobotDirectionStyle(): any {
    // Implement your logic for robot direction style transformation
    return {}; // Dummy return for now
  }

  isRobotHere(x: number, y: number): boolean {
    if (!this.robotPosition) return false;
    return this.robotPosition.x === x && this.robotPosition.y === y;
  }

  report() {
    if (!this.robotPosition) return;
    this.showTemporaryMessage(
      'success',
      'Robot Report',
      `${this.robotPosition.x},${this.robotPosition.y},${this.robotPosition.f}`
    );
  }

  turnLeft() {
    if (!this.robotPosition) return;
    const currentIndex = DIRECTIONS.indexOf(this.robotPosition.f);
    this.robotPosition.f = DIRECTIONS[(currentIndex + 3) % DIRECTIONS.length]; // Turns left
  }

  turnRight() {
    if (!this.robotPosition) return;
    const currentIndex = DIRECTIONS.indexOf(this.robotPosition.f);
    this.robotPosition.f = DIRECTIONS[(currentIndex + 1) % DIRECTIONS.length]; // Turns right
  }

  move() {
    if (!this.robotPosition) return;
    const move = MOVES[this.robotPosition.f];
    const newX = this.robotPosition.x + move.x;
    const newY = this.robotPosition.y + move.y;

    if (this.isValidCell(newX, newY)) {
      this.robotPosition.x = newX;
      this.robotPosition.y = newY;
      this.showTemporaryMessage(
        'success',
        'Robot Moved',
        `Moved at: ${newX},${newY}`
      );
    }
  }
}
