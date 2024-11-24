import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { AnyActor, assign, createActor, setup } from 'xstate';
import { PlaceEvent } from './models/place.event';
import { Direction, RobotContext } from './models/robot-context.model';
import { StatusMessage } from './models/status-message.model';

// #region Type aliases (1)

export type RobotEvent = { type: 'PLACE'; x: number; y: number; f: Direction } | { type: 'MOVE' } | { type: 'LEFT' } | { type: 'RIGHT' } | { type: 'REPORT' };

// #endregion Type aliases (1)

// #region Classes (1)

@Injectable()
export class RobotMachineService {
  // #region Properties (5)

  private actor!: AnyActor;

  private isValidCellSubject: Subject<boolean> = new ReplaySubject<boolean>(1);
  public isValidCell$: Observable<boolean> = this.isValidCellSubject.asObservable();

  private positionSubject: Subject<RobotContext> = new ReplaySubject<RobotContext>(1);
  private statusMessageSubject: ReplaySubject<StatusMessage> = new ReplaySubject<StatusMessage>(1);

  public position$: Observable<RobotContext> = this.positionSubject.asObservable();
  public statusMessage$: Observable<StatusMessage> = this.statusMessageSubject.asObservable();

  // #endregion Properties (5)

  // #region Constructors (1)

  constructor() {
    this.initialize();
  }

  // #endregion Constructors (1)

  // #region Public Methods (3)

  public isValidCell(x: number, y: number): boolean {
    if (x >= 0 && x <= 4 && y >= 0 && y <= 4) {
      // update the isValidCellSubject; indicates that the cell is valid for a move | place action
      this.isValidCellSubject.next(true);
      return true;

      // // update/set the position
      // const position: RobotContext = { x, y, f: 'NORTH' };
      // this.positionSubject.next(position);
    } else {
      return false;
    }
  }

  public showState() {
    this.actor.subscribe((state) => {
      if (state) {
        console.log(this.actor.getSnapshot());
      }
    });
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

  // #endregion Public Methods (3)

  // #region Private Methods (5)

  private assignNewPosition(position: RobotContext) {
    console.log('assignNewPosition', position);
    this.positionSubject.next(position);
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

    const event: PlaceEvent = { type: 'PLACE', x: position.x, y: position.y, f: position.f };
    this.actor.send(event);
  }

  private initialize() {
    this.position$.subscribe((position) => {
      this.handlePositionChange(position);
    });
  }

  private async initializeMachine(robotContext: RobotContext) {
    const wf = setup({
      types: {
        context: {} as RobotContext,
        input: {} as RobotContext,
      },
      guards: {
        isValidPosition: (context, event) => {
          // const { x, y, f } = context;
          // return x >= 0 && x <= 4 && y >= 0 && y <= 4;
          return true;
        },
      },
      actions: {
        /**
         * Assigns a new position to the robot.
         *
         * This action updates the robot's current position to the specified
         * position provided in the parameters. It uses the `assignNewPosition`
         * method to propagate this change to the relevant observers.
         *
         * @param _ - The context parameter, which is not used in this action.
         * @param params - An object containing the new position of the robot
         *                 as a RobotContext. This includes the x and y coordinates
         *                 and the facing direction (f).
         */
        assignNewPosition: (_, params: { position: RobotContext }) => {
          this.assignNewPosition(params.position);
        },
        /**
         * Reports the current status message of the robot.
         *
         * This action sends a status message, encapsulated in a `StatusMessage` object,
         * to all observers via the `statusMessageSubject`.
         *
         * @param _ - The context parameter, which is not used in this action.
         * @param params - An object containing a `message` property which is an instance of `StatusMessage`.
         *                 This message provides information about the current status of the robot,
         *                 such as success, idle, or placed status, along with additional description.
         */
        reportStatus: (_, params: { message: StatusMessage }) => {
          this.sendStatusMessage(params.message);
        },
      },
    }).createMachine({
      id: 'robotWorkflow',
      initial: 'idle',
      context: () => ({
        x: robotContext.x,
        y: robotContext.y,
        f: robotContext.f,
      }),
      states: {
        idle: {
          entry: [
            {
              type: 'reportStatus',
              params: {
                message: new StatusMessage('success', 'Robot is idle.', 'Robot is waiting for commands.'),
              },
            },
          ],
          on: {
            PLACE: {
              target: 'placed',
            },
          },
        },
        placed: {
          entry: [
            {
              type: 'reportStatus',
              params: { context: robotContext, message: new StatusMessage('success', 'Robot is placed.', `Placed at: ${robotContext.x},${robotContext.y}.`) },
            },
            // {
            //   type: 'assignNewPosition',
            //   params: { position: robotContext },
            // },
          ],
          on: {
            MOVE: {},
            PLACE: {
              target: 'placed',
              reenter: true,
              actions: [
                {
                  type: 'assignNewPosition',
                  params: { position: robotContext },
                },
              ],
            },
          },
        },
      },
    });

    this.actor = createActor(wf, { ...robotContext, input: robotContext }).start();

    // const machineConfig = setup({
    //   types: {
    //     context: {} as RobotContext,
    //     input: {} as RobotContext,
    //   },
    //   guards: {
    //     isValidPosition: (context, event) => {
    //       const { x, y } = event as any;
    //       return x >= 0 && y >= 0;
    //     },
    //     canMove: (context) => {
    //       const { x, y, f } = context;
    //       switch (f) {
    //         case 'NORTH':
    //           return y < 5;
    //         case 'EAST':
    //           return x < 5;
    //         case 'SOUTH':
    //           return y > 0;
    //         case 'WEST':
    //           return x > 0;
    //         default:
    //           return false;
    //       }
    //     },
    //   },
    //   actions: {},
    // }).createMachine({
    //   id: 'robot',
    //   initial: 'idle',
    //   context: () => ({
    //     x: robotContext.x,
    //     y: robotContext.y,
    //     f: robotContext.f,
    //   }),
    //   states: {
    //     idle: {
    //       on: {
    //         PLACE: {
    //           target: 'placed',
    //           cond: 'isValidPosition',
    //           actions: 'assignNewPosition',
    //         },
    //       },
    //     },
    //     placed: {
    //       on: {
    //         // MOVE: {
    //         //   actions: 'moveRobot',
    //         //   cond: 'canMove',
    //         // },
    //         // LEFT: {
    //         //   actions: 'turnLeft',
    //         // },
    //         // RIGHT: {
    //         //   actions: 'turnRight',
    //         // },
    //         PLACE: {
    //           actions: 'assignNewPosition',
    //           cond: 'isValidPosition',
    //         },
    //         REPORT: {
    //           actions: 'reportStatus',
    //         },
    //       },
    //     },
    //   },
    // });
  }

  private sendStatusMessage(message: StatusMessage) {
    console.log('sendStatusMessage', message);
    this.statusMessageSubject.next(message);
  }

  // #endregion Private Methods (5)
}

// #endregion Classes (1)
