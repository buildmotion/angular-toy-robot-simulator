import { RobotMachineService } from './robot-machine.service';
import { Direction } from './models/robot-context.model';
import { StatusMessage } from './models/status-message.model';

describe('RobotMachineService', () => {
  let service: RobotMachineService;

  beforeEach(() => {
    service = new RobotMachineService();
  });

  it('should place the robot at 0,0,NORTH', () => {
    service.placeRobot({ x: 0, y: 0, f: 'NORTH' as Direction });
    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 0, y: 0, f: 'NORTH' as Direction });
    });
  });

  it('should move the robot from 0,0,NORTH to 0,1,NORTH', () => {
    const initialPosition = { x: 0, y: 0, f: 'NORTH' as Direction };
    service.placeRobot(initialPosition);
    service.move(initialPosition);
    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 0, y: 1, f: 'NORTH' as Direction });
    });
  });

  it('should turn left from NORTH to WEST', () => {
    const initialPosition = { x: 0, y: 0, f: 'NORTH' as Direction };
    service.placeRobot(initialPosition);
    service.turnLeft(initialPosition);
    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 0, y: 0, f: 'WEST' as Direction });
    });
  });

  it('should turn right from NORTH to EAST', () => {
    const initialPosition = { x: 0, y: 0, f: 'NORTH' as Direction };
    service.placeRobot(initialPosition);
    service.turnRight(initialPosition);
    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 0, y: 0, f: 'EAST' as Direction });
    });
  });

  it('should report the current position', () => {
    const initialPosition = { x: 1, y: 2, f: 'NORTH' as Direction };
    service.placeRobot(initialPosition);
    service.move(initialPosition);
    service.move(initialPosition);
    service.turnRight(initialPosition);
    service.move(initialPosition);

    service.report(initialPosition);

    service.statusMessage$.subscribe((status: StatusMessage) => {
      expect(status.detail).toContain(`${initialPosition.x},${initialPosition.y},${initialPosition.f}`);
    });
  });

  it('should ignore commands before PLACE', () => {
    const moveCommand = { x: 0, y: 0, f: 'NORTH' as Direction };
    service.move(moveCommand);
    // Expect no emissions because the robot isn't placed yet
    service.position$.subscribe((position) => {
      expect(position).toBeUndefined();
    });
  });

  it('should not place the robot out of grid bounds', () => {
    const invalidPosition = { x: -1, y: -1, f: 'NORTH' as Direction };
    service.placeRobot(invalidPosition);
    // Expect no emissions for an invalid place
    service.position$.subscribe((position) => {
      expect(position).toBeUndefined();
    });
  });
});

describe('RobotMachineService Out of bounds Movements', () => {
  let service: RobotMachineService;

  beforeEach(() => {
    service = new RobotMachineService();
  });

  it('should throw an error when moving South out of bounds from 0,0', () => {
    const initialPosition = { x: 0, y: 0, f: 'SOUTH' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 0, y: 0, f: 'SOUTH' as Direction });
    });
  });

  it('should throw an error when moving West out of bounds from 0,0', () => {
    const initialPosition = { x: 0, y: 0, f: 'WEST' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 0, y: 0, f: 'WEST' as Direction });
    });
  });

  it('should throw an error when moving West out of bounds from 0,1', () => {
    const initialPosition = { x: 0, y: 1, f: 'WEST' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 1, y: 0, f: 'WEST' as Direction });
    });
  });

  it('should throw an error when moving West out of bounds from 0,2', () => {
    const initialPosition = { x: 0, y: 2, f: 'WEST' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 1, y: 0, f: 'WEST' as Direction });
    });
  });

  it('should throw an error when moving West out of bounds from 0,3', () => {
    const initialPosition = { x: 0, y: 3, f: 'WEST' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 1, y: 0, f: 'WEST' as Direction });
    });
  });

  it('should throw an error when moving North out of bounds from 0,4', () => {
    const initialPosition = { x: 0, y: 4, f: 'NORTH' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 0, y: 4, f: 'NORTH' as Direction });
    });
  });

  it('should throw an error when moving South out of bounds from 1,0', () => {
    const initialPosition = { x: 1, y: 0, f: 'SOUTH' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 1, y: 0, f: 'South' as Direction });
    });
  });

  it('should throw an error when moving North out of bounds from 1,4', () => {
    const initialPosition = { x: 1, y: 4, f: 'NORTH' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 1, y: 4, f: 'NORTH' as Direction });
    });
  });

  it('should throw an error when moving North out of bounds from 2,4', () => {
    const initialPosition = { x: 2, y: 4, f: 'NORTH' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 2, y: 4, f: 'NORTH' as Direction });
    });
  });

  it('should throw an error when moving North out of bounds from 3,4', () => {
    const initialPosition = { x: 3, y: 4, f: 'NORTH' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 3, y: 4, f: 'NORTH' as Direction });
    });
  });

  it('should throw an error when moving South out of bounds from 2,0', () => {
    const initialPosition = { x: 2, y: 0, f: 'SOUTH' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 2, y: 0, f: 'South' as Direction });
    });
  });

  it('should throw an error when moving South out of bounds from 3,0', () => {
    const initialPosition = { x: 3, y: 0, f: 'SOUTH' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 3, y: 0, f: 'SOUTH' as Direction });
    });
  });

  it('should throw an error when moving East out of bounds from 4,0', () => {
    const initialPosition = { x: 4, y: 0, f: 'EAST' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 4, y: 0, f: 'EAST' as Direction });
    });
  });

  it('should throw an error when moving East out of bounds from 4,0', () => {
    const initialPosition = { x: 4, y: 0, f: 'EAST' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 4, y: 0, f: 'EAST' as Direction });
    });
  });

  it('should throw an error when moving South out of bounds from 4,0', () => {
    const initialPosition = { x: 4, y: 0, f: 'SOUTH' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 4, y: 0, f: 'SOUTH' as Direction });
    });
  });

  it('should throw an error when moving East out of bounds from 4,1', () => {
    const initialPosition = { x: 4, y: 1, f: 'EAST' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 4, y: 1, f: 'EAST' as Direction });
    });
  });

  it('should throw an error when moving East out of bounds from 4,2', () => {
    const initialPosition = { x: 4, y: 2, f: 'EAST' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 4, y: 2, f: 'EAST' as Direction });
    });
  });

  it('should throw an error when moving East out of bounds from 4,3', () => {
    const initialPosition = { x: 4, y: 3, f: 'EAST' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 4, y: 3, f: 'EAST' as Direction });
    });
  });

  it('should throw an error when moving North out of bounds from 4,4', () => {
    const initialPosition = { x: 4, y: 4, f: 'NORTH' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 4, y: 4, f: 'NORTH' as Direction });
    });
  });

  it('should throw an error when moving East out of bounds from 4,4', () => {
    const initialPosition = { x: 4, y: 4, f: 'EAST' as Direction };
    service.placeRobot(initialPosition);

    expect(() => {
      service.move(initialPosition);
    }).toThrow('Invalid Move: Stay on the board - choose a different move.');

    service.position$.subscribe((position) => {
      expect(position).toEqual({ x: 4, y: 4, f: 'EAST' as Direction });
    });
  });
});
