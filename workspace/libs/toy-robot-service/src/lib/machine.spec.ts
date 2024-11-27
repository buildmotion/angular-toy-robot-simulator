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

type StateType = (typeof STATES)[keyof typeof STATES];

const workflow = setup({
  types: {
    context: {} as {},
    events: {} as { type: 'PLAY' | 'STOP' | 'EAT' | 'FETCH' | 'CHASE' | 'MUD' },
  },
  actions: {},
}).createMachine({
  id: 'Lukka',
  initial: STATES.IDLE,
  states: {
    [STATES.IDLE]: {
      on: {
        PLAY: {
          target: STATES.PLAYING,
        },
        EAT: {
          target: STATES.EATING,
        },
      },
    },
    [STATES.EATING]: {},
    [STATES.PLAYING]: {
      initial: STATES.MUDDING,
      states: {
        [STATES.MUDDING]: {
          on: {
            FETCH: {
              target: STATES.FETCHING,
            },
            CHASE: {
              target: STATES.CHASING,
            },
            STOP: {
              target: `#Lukka.${STATES.IDLE}`,
            },
          },
        },
        [STATES.FETCHING]: {
          on: {
            MUD: {
              target: STATES.MUDDING,
            },
            CHASE: {
              target: STATES.CHASING,
            },
            STOP: {
              target: `#Lukka.${STATES.IDLE}`,
            },
          },
        },
        [STATES.CHASING]: {
          on: {
            MUD: {
              target: STATES.MUDDING,
            },
            FETCH: {
              target: STATES.FETCHING,
            },
            STOP: {
              target: `#Lukka.${STATES.IDLE}`,
            },
          },
        },
      },
      on: {
        STOP: {
          target: STATES.IDLE,
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
      expect(actor.getSnapshot().value).toEqual('idle');
      expect(actor.getSnapshot().value).toEqual(STATES.IDLE);
    });

    it('should transition to [playing] state when PLAY event is triggered', () => {
      actor.send({ type: 'PLAY' });
      expect(actor.getSnapshot().value).toEqual({ playing: 'mudding' });
      expect(actor.getSnapshot().value).toEqual({ [STATES.PLAYING]: STATES.MUDDING });
    });

    it('should transition to [eating] state when EAT event is triggered', () => {
      actor.send({ type: 'EAT' });
      expect(actor.getSnapshot().value).toEqual('eating');
      expect(actor.getSnapshot().value).toEqual(STATES.EATING);
    });

    it('should transition to [idle] state when STOP event is triggered', () => {
      actor.send({ type: 'PLAY' });
      actor.send({ type: 'STOP' });
      expect(actor.getSnapshot().value).toEqual('idle');
      expect(actor.getSnapshot().value).toEqual(STATES.IDLE);
    });
  });

  describe('Playing State Transitions', () => {
    beforeEach(() => {
      actor.send({ type: 'PLAY' });
    });

    it('should start in [mudding] sub-state initially', () => {
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING]: STATES.MUDDING,
      });
    });

    it('should transition to [fetching] from [mudding] when FETCH event is triggered', () => {
      actor.send({ type: 'FETCH' });
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING]: STATES.FETCHING,
      });
    });

    it('should transition to [chasing] from [mudding] when CHASE event is triggered', () => {
      actor.send({ type: 'CHASE' });
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING]: STATES.CHASING,
      });
    });

    it('should transition to [mudding] from [fetching] when MUD event is triggered', () => {
      actor.send({ type: 'FETCH' });
      actor.send({ type: 'MUD' });
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING]: STATES.MUDDING,
      });
    });

    it('should transition to [chasing] from [fetching] when CHASE event is triggered', () => {
      actor.send({ type: 'FETCH' });
      actor.send({ type: 'CHASE' });
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING]: STATES.CHASING,
      });
    });

    it('should transition to [mudding] from [chasing] when MUD event is triggered', () => {
      actor.send({ type: 'CHASE' });
      actor.send({ type: 'MUD' });
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING]: STATES.MUDDING,
      });
    });

    it('should transition to [fetching] from [chasing] when FETCH event is triggered', () => {
      actor.send({ type: 'CHASE' });
      actor.send({ type: 'FETCH' });
      expect(actor.getSnapshot().value).toEqual({
        [STATES.PLAYING]: STATES.FETCHING,
      });
    });
  });
});
