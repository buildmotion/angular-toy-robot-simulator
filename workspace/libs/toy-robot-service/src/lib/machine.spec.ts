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
  initial: 'idle',
  states: {
    [STATES.IDLE as StateType]: {
      on: {
        PLAY: {
          target: 'playing',
        },
        EAT: {
          target: 'eating',
        },
      },
    },
    [STATES.EATING as StateType]: {},
    [STATES.PLAYING as StateType]: {
      initial: 'mudding',
      states: {
        mudding: {
          on: {
            FETCH: {
              target: 'fetching',
            },
            CHASE: {
              target: 'chasing',
            },
            STOP: {
              target: '#Lukka.idle',
            },
          },
        },
        fetching: {
          on: {
            MUD: {
              target: 'mudding',
            },
            CHASE: {
              target: 'chasing',
            },
            STOP: {
              target: '#Lukka.idle',
            },
          },
        },
        chasing: {
          on: {
            MUD: {
              target: 'mudding',
            },
            FETCH: {
              target: 'fetching',
            },
            STOP: {
              target: '#Lukka.idle',
            },
          },
        },
      },
      on: {
        STOP: {
          target: 'idle',
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
    });

    it('should transition to [playing] state when PLAY event is triggered', () => {
      actor.send({ type: 'PLAY' });
      expect(actor.getSnapshot().value).toEqual({ playing: 'mudding' });
    });

    it('should transition to [eating] state when EAT event is triggered', () => {
      actor.send({ type: 'EAT' });
      expect(actor.getSnapshot().value).toEqual('eating');
    });

    it('should transition to [idle] state when STOP event is triggered', () => {
      actor.send({ type: 'PLAY' });
      actor.send({ type: 'STOP' });
      expect(actor.getSnapshot().value).toEqual('idle');
    });
  });

  describe('Playing State Transitions', () => {
    beforeEach(() => {
      actor.send({ type: 'PLAY' });
    });

    it('should start in [mudding] sub-state initially', () => {
      expect(actor.getSnapshot().value).toEqual({
        playing: 'mudding',
      });
    });

    it('should transition to [fetching] from [mudding] when FETCH event is triggered', () => {
      actor.send({ type: 'FETCH' });
      expect(actor.getSnapshot().value).toEqual({
        playing: 'fetching',
      });
    });

    it('should transition to [chasing] from [mudding] when CHASE event is triggered', () => {
      actor.send({ type: 'CHASE' });
      expect(actor.getSnapshot().value).toEqual({
        playing: 'chasing',
      });
    });

    it('should transition to [mudding] from [fetching] when MUD event is triggered', () => {
      actor.send({ type: 'FETCH' });
      actor.send({ type: 'MUD' });
      expect(actor.getSnapshot().value).toEqual({
        playing: 'mudding',
      });
    });

    it('should transition to [chasing] from [fetching] when CHASE event is triggered', () => {
      actor.send({ type: 'FETCH' });
      actor.send({ type: 'CHASE' });
      expect(actor.getSnapshot().value).toEqual({
        playing: 'chasing',
      });
    });

    it('should transition to [mudding] from [chasing] when MUD event is triggered', () => {
      actor.send({ type: 'CHASE' });
      actor.send({ type: 'MUD' });
      expect(actor.getSnapshot().value).toEqual({
        playing: 'mudding',
      });
    });

    it('should transition to [fetching] from [chasing] when FETCH event is triggered', () => {
      actor.send({ type: 'CHASE' });
      actor.send({ type: 'FETCH' });
      expect(actor.getSnapshot().value).toEqual({
        playing: 'fetching',
      });
    });
  });
});
