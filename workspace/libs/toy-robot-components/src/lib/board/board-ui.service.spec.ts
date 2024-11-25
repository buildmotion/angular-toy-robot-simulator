import { TestBed } from '@angular/core/testing';
import { Direction, RobotContext, RobotMachineService, RobotPosition } from '@buildmotion/toy-robot-service';
import { MessageService } from 'primeng/api';
import { of, Subject } from 'rxjs';
import { BoardUIService } from './board-ui.service'; // Update the path according to your file structure

describe('BoardUIService', () => {
  let service: BoardUIService;
  let robotServiceMock: jest.Mocked<RobotMachineService>;
  let messageServiceMock: jest.Mocked<MessageService>;

  const mockRobotContext: RobotContext = { x: 0, y: 0, f: 'NORTH' as Direction };

  beforeEach(() => {
    robotServiceMock = {
      move: jest.fn(),
      placeRobot: jest.fn(),
      report: jest.fn(),
      turnLeft: jest.fn(),
      turnRight: jest.fn(),
      position$: of(mockRobotContext),
      statusMessage$: new Subject(),
    } as unknown as jest.Mocked<RobotMachineService>;

    messageServiceMock = {
      add: jest.fn(),
    } as unknown as jest.Mocked<MessageService>;

    TestBed.configureTestingModule({
      providers: [BoardUIService, { provide: RobotMachineService, useValue: robotServiceMock }, { provide: MessageService, useValue: messageServiceMock }],
    });

    service = TestBed.inject(BoardUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize robot position correctly', () => {
    expect(service.robotPosition).toEqual(mockRobotContext);
  });

  it('should call move on robotService when move is called', () => {
    //IMPLEMENT `move()` method on the mock robotServiceMock
    robotServiceMock.move.mockImplementation((position) => {
      position.x = 0;
      position.y = 1;
      position.f = 'NORTH';
    });

    service.placeRobot({ x: 0, y: 0, f: 'NORTH' });
    service.move();

    expect(robotServiceMock.move).toHaveBeenCalledWith(service.robotPosition);
    expect(service.robotPosition.x).toBe(0);
    expect(service.robotPosition.y).toBe(1);
    expect(service.robotPosition.f).toBe('NORTH');
  });

  it('should call placeRobot on robotService when placeRobot is called', () => {
    const newPosition: RobotPosition = { x: 1, y: 1, f: 'EAST' as Direction };

    service.placeRobot(newPosition);

    expect(robotServiceMock.placeRobot).toHaveBeenCalledWith(newPosition);
  });

  it('should call report on robotService when report is called', () => {
    service.report();
    expect(robotServiceMock.report).toHaveBeenCalledWith(service.robotPosition);
  });

  it('showRobot should return [true] if robot is at the specified position', () => {
    // mock;
    robotServiceMock.placeRobot.mockImplementation((position) => {
      position.x = 0;
      position.y = 1;
      position.f = 'NORTH';
    });

    // setup
    service.placeRobot({ x: 1, y: 1, f: 'NORTH' });

    // expect;
    expect(service.showRobot(1, 1)).toBe(false);
  });

  it('showRobot should return [false] if robot is at the specified position', () => {
    // setup default is at 0,0 North
    service = new BoardUIService(robotServiceMock, messageServiceMock);

    // expect;
    expect(service.showRobot(1, 1)).toBe(false);
  });

  it('should call turnLeft on robotService when turnLeft is called', () => {
    service.turnLeft();
    expect(robotServiceMock.turnLeft).toHaveBeenCalledWith(service.robotPosition);
  });

  it('should call turnRight on robotService when turnRight is called', () => {
    service.turnRight();
    expect(robotServiceMock.turnRight).toHaveBeenCalledWith(service.robotPosition);
  });

  it('position$ should emit correct values', (done) => {
    service.position$.subscribe((position) => {
      expect(position).toEqual(mockRobotContext);
      done();
    });
  });
});
