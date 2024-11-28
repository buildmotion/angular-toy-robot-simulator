import { AnyActor, createActor, setup } from 'xstate';

export interface LukkaContext {
  name: string;
  age: number;
  status: string;
}

export const STATES = {
  IDLE: 'idle' as const,
  PLAYING: 'playing' as const,
  EATING: 'eating' as const,
  MUDDING: 'mudding' as const,
  FETCHING: 'fetching' as const,
  CHASING: 'chasing' as const,
};

export const EVENTS = {
  PLAY: 'PLAY' as const,
  STOP: 'STOP' as const,
  EAT: 'EAT' as const,
  FETCH: 'FETCH' as const,
  CHASE: 'CHASE' as const,
  MUD: 'MUD' as const,
};

type StateType = (typeof STATES)[keyof typeof STATES];
type EventType = (typeof EVENTS)[keyof typeof EVENTS];

const initialStatus = 'Lukka is [idle] and [happy]!';

const workflow = setup({
  types: {
    context: {
      name: 'Lukka',
      age: 9,
      status: initialStatus,
    } as LukkaContext,
    events: {} as { type: EventType },
  },
  actions: {
    /**
     * Logs a new activity status to the console and updates the context's status.
     *
     * @param context - The current context of the machine which includes the existing status.
     * @param params - An object containing the new status string to log and update.
     *                 - newStatus: The new status message to be logged and set in the context.
     *
     * @returns The updated status of the context.
     *
     * This function is used as an action in state transitions to log and update the
     * activity status whenever a state transition occurs.
     */
    logActivity: (context, params: { newStatus: string }) => {
      console.log(params.newStatus);
      return (context.context.status = params.newStatus);
    },
  },
}).createMachine({
  id: 'Lukka',
  initial: STATES.IDLE as StateType,
  context: {
    name: 'Lukka',
    age: 9,
    status: initialStatus,
  },
  states: {
    [STATES.IDLE as StateType]: {
      entry: [
        {
          type: 'logActivity',
          params: { newStatus: initialStatus },
        },
      ],
      on: {
        [EVENTS.PLAY as EventType]: {
          target: STATES.PLAYING as StateType,
          /**
           * An array of actions to perform during a state transition.
           * Each action will have a type and optionally parameters.
           * In this setup, actions are utilized to log activity status
           * and update the machine context during transitions.
           */
          actions: [
            {
              type: 'updateStatus',
              params: { newStatus: 'Lukka is going to start [playing].' }, // example params
            },
          ],
        },
        [EVENTS.EAT as EventType]: {
          target: STATES.EATING as StateType,
          actions: [
            {
              type: 'updateStatus',
              params: { newStatus: 'Lukka is going to start [eating].' },
            },
          ],
        },
      },
    },
    [STATES.EATING as StateType]: {},
    [STATES.PLAYING as StateType]: {
      initial: STATES.MUDDING as StateType,
      entry: [
        {
          type: 'logActivity',
          params: { newStatus: 'Lukka is [playing] now.' },
        },
      ],
      states: {
        [STATES.MUDDING as StateType]: {
          /**
           * Executes upon entering the [mudding] state.
           * This action logs the activity status "Lukka is [mudding] now."
           * to the console and updates the context with the new status message.
           * The action is defined as 'logActivity' and is triggered as part of the
           * entry behavior when transitioning into the [mudding] state.
           */
          entry: [
            {
              type: 'logActivity',
              params: { newStatus: 'Lukka is [mudding] now.' },
            },
          ],
          on: {
            [EVENTS.FETCH as EventType]: {
              target: STATES.FETCHING as StateType,
              actions: [
                {
                  type: 'logActivity',
                  params: { newStatus: 'Lukka is going to start [fetching].' },
                },
              ],
            },
            [EVENTS.CHASE as EventType]: {
              target: STATES.CHASING as StateType,
              actions: [
                {
                  type: 'logActivity',
                  params: { newStatus: 'Lukka is going to start [chasing].' },
                },
              ],
            },
            [EVENTS.STOP as EventType]: {
              target: `#Lukka.${STATES.IDLE}` as StateType,
              actions: [
                {
                  type: 'logActivity',
                  params: { newStatus: 'Lukka is going to [stop] playing.' },
                },
              ],
            },
          },
        },
        [STATES.FETCHING as StateType]: {
          entry: [
            {
              type: 'logActivity',
              params: { newStatus: 'Lukka is [fetching] now.' },
            },
          ],
          on: {
            [EVENTS.MUD as EventType]: {
              target: STATES.MUDDING as StateType,
              actions: [
                {
                  type: 'logActivity',
                  params: { newStatus: 'Lukka is going to start [mudding].' },
                },
              ],
            },
            [EVENTS.CHASE as EventType]: {
              target: STATES.CHASING as StateType,
              actions: [
                {
                  type: 'logActivity',
                  params: { newStatus: 'Lukka is going to start [chasing].' },
                },
              ],
            },
            [EVENTS.STOP as EventType]: {
              target: `#Lukka.${STATES.IDLE}` as StateType,
              actions: [
                {
                  type: 'logActivity',
                  params: { newStatus: 'Lukka is going to [stop] playing.' },
                },
              ],
            },
          },
        },
        [STATES.CHASING as StateType]: {
          entry: [
            {
              type: 'logActivity',
              params: { newStatus: 'Lukka is [chasing] now.' },
            },
          ],
          on: {
            [EVENTS.MUD as EventType]: {
              target: STATES.MUDDING as StateType,
              actions: [
                {
                  type: 'logActivity',
                  params: { newStatus: 'Lukka is going to [start] mudding.' },
                },
              ],
            },
            [EVENTS.FETCH as EventType]: {
              target: STATES.FETCHING as StateType,
              actions: [
                {
                  type: 'logActivity',
                  params: { newStatus: 'Lukka is going to [start] fetching.' },
                },
              ],
            },
            [EVENTS.STOP as EventType]: {
              target: `#Lukka.${STATES.IDLE}` as StateType,
              actions: [
                {
                  type: 'logActivity',
                  params: { newStatus: 'Lukka is going to [stop] playing.' },
                },
              ],
            },
          },
        },
      },
    },
  },
});

describe('Lukka Machine', () => {
  let actor!: AnyActor;

  beforeEach(() => {
    actor = createActor(workflow);
    actor.start();
  });

  afterEach(() => {
    actor.stop();
  });

  describe('Initial State', () => {
    it('should start in the [idle] state when workflow starts/initializes', () => {
      expect(actor.getSnapshot().value).toEqual(STATES.IDLE as StateType);
    });

    it('should initialize workflow with default [context]', () => {
      expect(actor.getSnapshot().context).toEqual({
        name: 'Lukka',
        age: 9,
        status: initialStatus,
      });
    });

    it('should transition to [playing] state when PLAY event is triggered', () => {
      actor.send({ type: EVENTS.PLAY as EventType });
      expect(actor.getSnapshot().value).toEqual({ [STATES.PLAYING as StateType]: STATES.MUDDING as StateType });
    });

    it('should transition to [eating] state when EAT event is triggered', () => {
      actor.send({ type: EVENTS.EAT as EventType });
      expect(actor.getSnapshot().value).toEqual(STATES.EATING as StateType);
    });

    it('should transition to [idle] state when STOP event is triggered', () => {
      actor.send({ type: EVENTS.PLAY as EventType });
      actor.send({ type: EVENTS.STOP as EventType });
      expect(actor.getSnapshot().value).toEqual(STATES.IDLE as StateType);
    });
  });

  describe('Playing State Transitions', () => {
    beforeEach(() => {
      actor.send({ type: EVENTS.PLAY as EventType });
    });

    it('should start in [mudding] sub-state initially', () => {
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING as StateType]: STATES.MUDDING as StateType,
      });
    });

    it('should transition to [fetching] from [mudding] when FETCH event is triggered', () => {
      actor.send({ type: EVENTS.FETCH as EventType });
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING as StateType]: STATES.FETCHING as StateType,
      });
    });

    it('should transition to [chasing] from [mudding] when CHASE event is triggered', () => {
      actor.send({ type: EVENTS.CHASE as EventType });
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING as StateType]: STATES.CHASING as StateType,
      });
    });

    it('should transition to [mudding] from [fetching] when MUD event is triggered', () => {
      actor.send({ type: EVENTS.FETCH as EventType });
      actor.send({ type: EVENTS.MUD as EventType });
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING as StateType]: STATES.MUDDING as StateType,
      });
    });

    it('should transition to [chasing] from [fetching] when CHASE event is triggered', () => {
      actor.send({ type: EVENTS.FETCH as EventType });
      actor.send({ type: EVENTS.CHASE as EventType });
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING as StateType]: STATES.CHASING as StateType,
      });
    });

    it('should transition to [mudding] from [chasing] when MUD event is triggered', () => {
      actor.send({ type: EVENTS.CHASE as EventType });
      actor.send({ type: EVENTS.MUD as EventType });
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING as StateType]: STATES.MUDDING as StateType,
      });
    });

    it('should transition to [fetching] from [chasing] when FETCH event is triggered', () => {
      actor.send({ type: EVENTS.CHASE as EventType });
      actor.send({ type: EVENTS.FETCH as EventType });

      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING as StateType]: STATES.FETCHING as StateType,
      });
    });
  });
});
