import { Component, OnInit } from '@angular/core';
import { DIRECTIONS, MOVES, RobotPosition } from '@buildmotion/toy-robot-service';
import { Message } from 'primeng/api';
import { BoardUIService } from './board-ui.service.service';
import { Observable } from 'rxjs';

// #region Interfaces (1)

interface Cell {
  // #region Properties (3)

  active: boolean;
  x: number;
  y: number;

  // #endregion Properties (3)
}

// #endregion Interfaces (1)

// #region Classes (1)

@Component({
  selector: 'robot-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  // #region Properties (3)

  public grid!: Cell[][];
  public messages!: Message[];
  public robotPosition!: RobotPosition;

  isValid$!: Observable<boolean>;

  // #endregion Properties (3)

  // #region Constructors (1)

  constructor(private uiService: BoardUIService) {}

  // #endregion Constructors (1)

  // #region Public Methods (8)

  public getRobotDirectionStyle(): any {
    // Implement your logic for robot direction style transformation
    return {}; // Dummy return for now
  }

  public isRobotHere(x: number, y: number): boolean {
    let showRobot = false;
    if (!this.robotPosition) {
      return showRobot;
    } else {
      showRobot = this.robotPosition.x === x && this.robotPosition.y === y;
    }
    return showRobot;
  }

  public move() {
    if (!this.robotPosition) return;
    const move = MOVES[this.robotPosition.f];
    const newX = this.robotPosition.x + move.x;
    const newY = this.robotPosition.y + move.y;

    this.robotPosition.x = newX;
    this.robotPosition.y = newY;
    this.showTemporaryMessage('success', 'Robot Moved', `Moved at: ${newX},${newY}`);
    //TODO: ADD VALIDATION TO THE MOVE CALL; CHECK IF THE NEW POSITION IS VALID
    // if (this.uiService.isValidCell(newX, newY)) {
    // }
  }

  public ngOnInit() {
    this.grid = Array.from({ length: 5 }, (_, x) => Array.from({ length: 5 }, (_, y) => ({ x, y, active: false })));

    this.uiService.statusMessage$.subscribe((statusMessage) => {
      if (statusMessage) {
        this.showTemporaryMessage(statusMessage.severity, statusMessage.summary, statusMessage.detail);
      }
    });

    this.uiService.isValid$ = this.uiService.isValid$;
  }

  /**
   * Places the robot at the specified coordinates on the grid facing north.
   * Updates the robot's position if the specified cell is valid.
   *
   * @param x - The x-coordinate on the grid where the robot should be placed.
   * @param y - The y-coordinate on the grid where the robot should be placed.
   */
  public placeRobot(x: number, y: number) {
    this.robotPosition = { x, y, f: 'NORTH' }; // Always initialize robot position with facing direction 'NORTH'
    this.uiService.updateRobotPosition(this.robotPosition); // Update UI with new robot position
  }

  public report() {
    //TODO: naive to assume robotPosition is always set; use workflow/machine state to know when [report] is allowed/enabled
    if (!this.robotPosition) return;
    this.showTemporaryMessage('success', 'Robot Report', `${this.robotPosition.x},${this.robotPosition.y},${this.robotPosition.f}`);
  }

  public turnLeft() {
    if (!this.robotPosition) return;
    const currentIndex = DIRECTIONS.indexOf(this.robotPosition.f);
    this.robotPosition.f = DIRECTIONS[(currentIndex + 3) % DIRECTIONS.length]; // Turns left
  }

  public turnRight() {
    if (!this.robotPosition) return;
    const currentIndex = DIRECTIONS.indexOf(this.robotPosition.f);
    this.robotPosition.f = DIRECTIONS[(currentIndex + 1) % DIRECTIONS.length]; // Turns right
  }

  // #endregion Public Methods (8)

  // #region Private Methods (1)

  private showTemporaryMessage(severity: 'success' | 'error' | 'info', summary: string, detail: string) {
    this.uiService.messageService.add({ severity, summary, detail });
    setTimeout(() => {
      this.uiService.messageService.clear();
    }, 10000);
  }

  // #endregion Private Methods (1)

  // #endregion Classes (1)
}
