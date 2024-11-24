export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

// Ordered directions for circular rotation
export const DIRECTIONS: Direction[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

// Moves mapped to directions
export const MOVES = {
  NORTH: { x: 0, y: 1 },
  EAST: { x: 1, y: 0 },
  SOUTH: { x: 0, y: -1 },
  WEST: { x: -1, y: 0 },
} as const;

export class RobotContext {
  x!: number;
  y!: number;
  f!: Direction;

  constructor(x: number, y: number, f: Direction) {
    this.x = x;
    this.y = y;
    this.f = f;
  }
}
