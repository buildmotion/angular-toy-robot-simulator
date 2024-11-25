import { Injectable } from '@angular/core';
import { DIRECTIONS, MOVES, RobotContext, RobotMachineService, RobotPosition, StatusMessage } from '@buildmotion/toy-robot-service';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardUIService {
  // #region Properties (4)

  private isValidSubject = new BehaviorSubject<boolean>(false);
  private positionSubject = new ReplaySubject<RobotContext>(1);

  isValid$ = this.isValidSubject.asObservable();
  public robotPosition!: RobotContext;
  public position$ = this.positionSubject.asObservable();
  statusMessage$!: Observable<StatusMessage>;

  // #endregion Properties (4)

  // #region Constructors (1)

  constructor(private robotService: RobotMachineService, public messageService: MessageService) {
    this.initialize();
  }

  // #endregion Constructors (1)

  // #region Public Methods (7)

  public isValidCell(x: number, y: number) {
    this.robotService.isValidCell(x, y);
  }

  public move() {
    this.robotService.move(this.robotPosition);
  }

  public placeRobot(robotPosition: RobotPosition) {
    this.robotService.placeRobot(robotPosition);
  }

  public report() {
    this.robotService.report(this.robotPosition);
  }

  public showRobot(x: number, y: number): boolean {
    let showRobot = false;
    if (!this.robotPosition) {
      return showRobot;
    } else {
      showRobot = this.robotPosition.x === x && this.robotPosition.y === y;
    }
    return showRobot;
  }

  public turnLeft() {
    this.robotService.turnLeft(this.robotPosition);
  }

  public turnRight() {
    this.robotService.turnRight(this.robotPosition);
  }

  // #endregion Public Methods (7)

  // #region Private Methods (1)

  private initialize() {
    this.robotService.position$.subscribe((position) => {
      this.robotPosition = position;
      this.positionSubject.next(position);
    });

    this.statusMessage$ = this.robotService.statusMessage$;

    this.robotService.isValidCell$.subscribe((isValid) => {
      this.isValidSubject.next(isValid);
    });
  }

  // #endregion Private Methods (1)
}
