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

const workflow = setup({
  types: {
    context: {} as LukkaContext,
    events: {} as { type: EventType },
  },
  actions: {},
}).createMachine({
  id: 'Lukka',
  initial: STATES.IDLE as StateType,
  context: {
    name: 'Lukka',
    age: 9,
    status: 'happy',
  },
  states: {
    [STATES.IDLE as StateType]: {
      on: {
        [EVENTS.PLAY as EventType]: {
          target: STATES.PLAYING as StateType,
        },
        [EVENTS.EAT as EventType]: {
          target: STATES.EATING as StateType,
        },
      },
    },
    [STATES.EATING as StateType]: {},
    [STATES.PLAYING as StateType]: {
      initial: STATES.MUDDING as StateType,
      states: {
        [STATES.MUDDING as StateType]: {
          on: {
            [EVENTS.FETCH as EventType]: {
              target: STATES.FETCHING as StateType,
            },
            [EVENTS.CHASE as EventType]: {
              target: STATES.CHASING as StateType,
            },
            [EVENTS.STOP as EventType]: {
              target: `#Lukka.${STATES.IDLE}` as StateType,
            },
          },
        },
        [STATES.FETCHING as StateType]: {
          on: {
            [EVENTS.MUD as EventType]: {
              target: STATES.MUDDING as StateType,
            },
            [EVENTS.CHASE as EventType]: {
              target: STATES.CHASING as StateType,
            },
            [EVENTS.STOP as EventType]: {
              target: `#Lukka.${STATES.IDLE}` as StateType,
            },
          },
        },
        [STATES.CHASING as StateType]: {
          on: {
            [EVENTS.MUD as EventType]: {
              target: STATES.MUDDING as StateType,
            },
            [EVENTS.FETCH as EventType]: {
              target: STATES.FETCHING as StateType,
            },
            [EVENTS.STOP as EventType]: {
              target: `#Lukka.${STATES.IDLE}` as StateType,
            },
          },
        },
      },
      on: {
        [EVENTS.STOP as EventType]: {
          target: STATES.IDLE as StateType,
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
      expect(actor.getSnapshot().context).toEqual({
        name: 'Lukka',
        age: 9,
        status: 'happy',
      });
    });

    it('should initialize workflow with default [context]', () => {
      expect(actor.getSnapshot().context).toEqual({
        name: 'Lukka',
        age: 9,
        status: 'happy',
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
