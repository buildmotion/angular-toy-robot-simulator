import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { AnyActor, createActor, setup } from 'xstate';
import { Direction, DIRECTIONS, MOVES, RobotContext } from './models/robot-context.model';
import { RobotPosition } from './models/robot-position.model';
import { StatusMessage } from './models/status-message.model';

// #region Type aliases (1)

export type RobotEvent = { type: 'PLACE'; x: number; y: number; f: Direction } | { type: 'MOVE' } | { type: 'LEFT' } | { type: 'RIGHT' } | { type: 'REPORT' };

// #endregion Type aliases (1)

// #region Classes (1)

@Injectable()
export class RobotMachineService {
  report(robotPosition: RobotContext) {
    if (!robotPosition) return;
    this.sendStatusMessage(new StatusMessage('success', 'Robot Report', `${robotPosition.x},${robotPosition.y},${robotPosition.f}`));
  }
  // #region Properties (8)

  private actor!: AnyActor;
  private positionSubject: Subject<RobotContext> = new ReplaySubject<RobotContext>(1);
  private statusMessageSubject: ReplaySubject<StatusMessage> = new ReplaySubject<StatusMessage>(1);

  public GRID_SIZE = 5;
  public position$: Observable<RobotContext> = this.positionSubject.asObservable();
  public statusMessage$: Observable<StatusMessage> = this.statusMessageSubject.asObservable();

  // #endregion Properties (8)

  // #region Constructors (1)

  constructor() {
    this.initialize();
  }

  // #endregion Constructors (1)

  // #region Public Methods (7)

  public move(robotPosition: RobotContext) {
    if (!robotPosition) return;

    const newMove = MOVES[robotPosition.f];
    const newX = robotPosition.x + newMove.x;
    const newY = robotPosition.y + newMove.y;

    if (this.canMove(newX, newY, robotPosition.f)) {
      {
        robotPosition.x = newX;
        robotPosition.y = newY;
        this.positionSubject.next(robotPosition);

        this.sendStatusMessage(new StatusMessage('success', 'Robot Moved', `Moved to: ${newX},${newY}.`));
      }
    } else {
      this.sendStatusMessage(new StatusMessage('error', 'Invalid Move', `Stay on the board - choose a different move.`));
      throw new Error(`Invalid Move: Stay on the board - choose a different move. Current Position: x=${robotPosition.x}, y=${robotPosition.y}, f=${robotPosition.f}`);
    }
  }

  public placeRobot(robotPosition: RobotPosition) {
    if (this.canMove(robotPosition.x, robotPosition.y, robotPosition.f)) {
      this.positionSubject.next(robotPosition);

      this.sendStatusMessage(new StatusMessage('success', 'Robot Placed', `Placed at: ${robotPosition.x},${robotPosition.y}.`));
    }
  }

  public turnLeft(robotPosition: RobotContext) {
    if (!robotPosition) return;

    const currentIndex = DIRECTIONS.indexOf(robotPosition.f);
    robotPosition.f = DIRECTIONS[(currentIndex + 3) % DIRECTIONS.length]; // Turns left

    this.positionSubject.next(robotPosition);
    this.sendStatusMessage(new StatusMessage('success', 'Robot Turned Left', `Facing: ${robotPosition.f}.`));
  }

  public turnRight(robotPosition: RobotContext) {
    if (!robotPosition) return;
    const currentIndex = DIRECTIONS.indexOf(robotPosition.f);
    robotPosition.f = DIRECTIONS[(currentIndex + 1) % DIRECTIONS.length]; // Turns right

    this.positionSubject.next(robotPosition);
    this.sendStatusMessage(new StatusMessage('success', 'Robot Turned Right', `Facing: ${robotPosition.f}.`));
  }

  /**
   * Updates the robot's position.
   *
   * This function pushes a new position for the robot into the positionSubject,
   * which subsequently updates all observers of this subject with the new RobotContext.
   *
   * @param position - The new position of the robot, which should include the x and y coordinates
   *                   and facing direction (f). This is of type RobotContext.
   */
  public updateRobotPosition(position: RobotContext) {
    this.positionSubject.next(position);
  }

  // #endregion Public Methods (7)

  // #region Private Methods (6)

  private assignNewPosition(position: RobotContext) {
    console.log('assignNewPosition', position);
    this.positionSubject.next(position);
  }

  private canMove(newX: number, newY: number, facing: Direction): boolean {
    if (facing === 'NORTH') return newY >= 0 && newY <= this.GRID_SIZE - 1;
    if (facing === 'EAST') return newX >= 0 && newX <= this.GRID_SIZE - 1;
    if (facing === 'SOUTH') return newY >= 0 && newY < this.GRID_SIZE - 1;
    if (facing === 'WEST') return newX >= 0 && newX < this.GRID_SIZE - 1;
    return false; // In case facing does not match any expected direction
  }

  /**
   * Handles changes in the robot's position.
   *
   * This method determines whether the robot machine has been initialized.
   * If the robot machine is not initialized, it calls the `initializeMachine` method
   * with the given position to set up the machine's initial state.
   * If the machine is already initialized, it constructs a `PlaceEvent` using the
   * provided position and sends this event to the robot machine to update its state.
   *
   * @param position - The new position of the robot, provided as a RobotContext
   *                   which includes the x and y coordinates, and the facing direction (f).
   */
  private async handlePositionChange(position: RobotContext) {
    if (!this.actor) {
      await this.initializeMachine(position);
    }

    //TODO: ENABLE THE WORKFLOW TO HANDLE THE PLACE EVENT
    // const event: PlaceEvent = { type: 'PLACE', x: position.x, y: position.y, f: position.f };
    // this.actor.send(event);
  }
  initializeMachine(position: RobotContext) {
    if (position) {
      //TODO: CREATE THE MACHINE SETUP AND CONFIGURATION;
    } else {
      throw new Error('Invalid Position: Robot position must be provided to initialize the machine.');
    }
  }

  private initialize() {
    this.position$.subscribe((position) => {
      this.handlePositionChange(position);
    });
  }

  private sendStatusMessage(message: StatusMessage) {
    this.statusMessageSubject.next(message);
  }

  // #endregion Private Methods (6)
}

// #endregion Classes (1)
