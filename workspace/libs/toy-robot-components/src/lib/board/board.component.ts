import { Component, OnInit } from '@angular/core';
import { Direction, Square } from '@buildmotion/toy-robot-service';
import { Message } from 'primeng/api';
import { BoardUIService } from './board-ui.service';
import { LoggerService } from '@buildmotion/logger';

/**
 * Component representing the robot board.
 * Handles the initialization and interaction with the robot on the grid.
 */
@Component({
  selector: 'robot-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  // #region Properties (3)

  public direction!: string;
  public grid!: Square[][];
  public messages!: Message[];

  // #endregion Properties (3)

  // #region Constructors (1)

  constructor(private uiService: BoardUIService, private logger: LoggerService) {
    this.logger.log('BoardComponent: Initialized with Logger: ' + this.logger.id);
  }

  // #endregion Constructors (1)

  // #region Public Methods (8)

  public isRobotHere(x: number, y: number): boolean {
    return this.uiService.showRobot(x, y);
  }

  public move() {
    this.uiService.move();
  }

  public ngOnInit() {
    this.grid = Array.from({ length: 5 }, (_, x) => Array.from({ length: 5 }, (_, y) => ({ x, y, active: false })));

    this.uiService.statusMessage$.subscribe((statusMessage) => {
      if (statusMessage) {
        this.showTemporaryMessage(statusMessage.severity, statusMessage.summary, statusMessage.detail);
      }
    });

    this.uiService.position$.subscribe((robotPosition) => {
      this.direction = robotPosition.f;
    });
  }

  /**
   * Places the robot at the specified coordinates on the grid facing north.
   * Updates the robot's position if the specified cell is valid.
   *
   * @param x - The x-coordinate on the grid where the robot should be placed.
   * @param y - The y-coordinate on the grid where the robot should be placed.
   */
  public placeRobot(x: number, y: number) {
    const robotPosition = { x, y, f: 'NORTH' as Direction }; // Always initialize robot position with facing direction 'NORTH'
    this.uiService.placeRobot(robotPosition); // Update UI with new robot position
  }

  public report() {
    this.uiService.report();
  }

  public turnLeft() {
    this.uiService.turnLeft();
  }

  public turnRight() {
    this.uiService.turnRight();
  }

  // #endregion Public Methods (8)

  // #region Private Methods (1)

  private showTemporaryMessage(severity: 'success' | 'error' | 'info', summary: string, detail: string) {
    this.uiService.messageService.add({ severity, summary, detail });
    setTimeout(() => {
      this.uiService.messageService.clear();
    }, 2500);
  }

  // #endregion Private Methods (1)
}
