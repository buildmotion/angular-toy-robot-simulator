import { Injectable } from '@angular/core';
import { RobotContext, RobotMachineService, RobotPosition, StatusMessage } from '@buildmotion/toy-robot-service';
import { MessageService } from 'primeng/api';
import { Observable, ReplaySubject } from 'rxjs';

/**
 * Service for handling UI operations related to a toy robot on a board.
 * It interfaces with the underlying RobotMachineService to manipulate the robot's state.
 */
@Injectable({
  providedIn: 'root',
})
export class BoardUIService {
  // #region Properties (4)

  /**
   * Subject that broadcasts the current robot position whenever it changes.
   * It provides 1-element buffer history of positions.
   */
  private positionSubject = new ReplaySubject<RobotContext>(1);

  /**
   * Observable that streams updates of the robot's position and context.
   */
  public position$ = this.positionSubject.asObservable();
  /**
   * The latest known position and context of the robot, including the direction it is facing.
   */
  public robotPosition!: RobotContext;
  /**
   * Observable that streams status messages from the robot service.
   */
  statusMessage$!: Observable<StatusMessage>;

  // #endregion Properties (4)

  // #region Constructors (1)

  /**
   * Initializes the BoardUIService with the given robot service and message service.
   *
   * @param robotService The service used to control the robot machine.
   * @param messageService The service used to display status messages in the UI.
   */
  constructor(private robotService: RobotMachineService, public messageService: MessageService) {
    this.initialize();
  }

  // #endregion Constructors (1)

  // #region Public Methods (6)

  /**
   * Makes the robot move one unit in the direction it is currently facing. The move command
   * will fail if the robot is at the edge of the board and moving in that direction would
   * cause it to fall off.
   */
  public move() {
    this.robotService.move(this.robotPosition);
  }

  /**
   * Places the robot on the board at the specified position and direction (default is North).
   * @param robotPosition The desired position and facing direction of the robot.
   */
  public placeRobot(robotPosition: RobotPosition) {
    this.robotService.placeRobot(robotPosition);
  }

  /**
   * Reports the current position and direction of the robot.
   */
  public report() {
    this.robotService.report(this.robotPosition);
  }

  /**
   * Determines if the robot is currently positioned at the provided (x, y) coordinates. Used to
   * manage the display of the robot on the board. The active square will show the robot if it is
   * at the specified coordinates.
   *
   * @param x The x-coordinate to check.
   * @param y The y-coordinate to check.
   * @returns `true` if the robot is at (x, y); otherwise, `false`.
   */
  public showRobot(x: number, y: number): boolean {
    let showRobot = false;
    if (!this.robotPosition) {
      return showRobot;
    } else {
      showRobot = this.robotPosition.x === x && this.robotPosition.y === y;
    }
    return showRobot;
  }

  /**
   * Turns the robot 90 degrees to the left from its current direction.
   */
  public turnLeft() {
    this.robotService.turnLeft(this.robotPosition);
  }

  /**
   * Turns the robot 90 degrees to the right from its current direction.
   */
  public turnRight() {
    this.robotService.turnRight(this.robotPosition);
  }

  // #endregion Public Methods (6)

  // #region Private Methods (1)

  /**
   * Initializes the service by subscribing to position and status message updates from the robot service.
   * Sets up the internal observables to reflect current robot state and messages.
   */
  private initialize() {
    this.robotService.position$.subscribe((position) => {
      this.robotPosition = position;
      this.positionSubject.next(position);
    });

    this.statusMessage$ = this.robotService.statusMessage$;
  }

  // #endregion Private Methods (1)
}
