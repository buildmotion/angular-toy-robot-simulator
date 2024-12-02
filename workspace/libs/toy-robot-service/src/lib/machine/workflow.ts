import { AnyEventObject, setup, assign } from 'xstate';
import { RobotContext } from '../models/robot-context.model';
import { RobotPosition } from '../models/robot-position.model';

//#region Event types

// Define Direction type for better type safety
export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

export type RobotPositionEvent = { type: 'PLACE'; position: RobotPosition };

// Define more specific events if needed
export type MoveEvent = { type: 'MOVE' };
export type TurnEvent = { type: 'TURN_LEFT' } | { type: 'TURN_RIGHT' };
export type ReportEvent = { type: 'REPORT' };

// Update the EventType to include all specific event types
export type EventType = RobotPositionEvent | MoveEvent | TurnEvent | ReportEvent;

// Adjust event schema to match the defined types
export const eventSchema = {
  events: {} as AnyEventObject | RobotPositionEvent,
};

//#endregion Event types

// Define the action function
// export const logPosition: ActionFunction<RobotContext, RobotPositionEvent, any, any, any, any, any, any, any> = (context, event) => {
//   if (event.type === 'PLACE' && 'position' in event) {
//     context = event.position;//update the context
//     console.info(`Robot placed at ${event.position.x},${event.position.y},${event.position.f}`);
//   }
// };

export const workflow = setup({
  types: {
    context: {} as RobotContext,
    events: eventSchema.events,
  },
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logPosition: (context: RobotContext | any, event: RobotPositionEvent | AnyEventObject) => {
      if (event.type === 'PLACE' && 'position' in event) {
        console.info(`Robot placed at ${event.position.x},${event.position.y},${event.position.f}`);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePosition: assign<RobotContext, RobotPositionEvent | AnyEventObject, any, any, any>((context, event) => {
      if (context.event.type === 'PLACE' && 'position' in context.event) {
        context.context = context.event.position;
        return context.context;
      }
      return {};
    }),
  },
}).createMachine({
  id: 'machine',
  initial: 'idle',
  context: {
    x: 0,
    y: 0,
    f: 'NORTH',
  },
  states: {
    idle: {
      on: {
        PLACE: {
          target: 'placed',
          actions: ['updatePosition'],
        },
      },
    },
    placed: {
      on: {
        MOVE: 'moving',
        LEFT: 'turningLeft',
        RIGHT: 'turningRight',
        REPORT: 'reporting',
        PLACE: {
          target: 'placed',
          actions: ['updatePosition'],
        },
      },
    },
    moving: {
      on: {
        MOVED: 'placed',
      },
    },
    turningLeft: {
      on: {
        TURNED_LEFT: 'placed',
      },
    },
    turningRight: {
      on: {
        TURNED_RIGHT: 'placed',
      },
    },
    reporting: {
      on: {
        REPORTED: 'placed',
      },
    },
  },
});
