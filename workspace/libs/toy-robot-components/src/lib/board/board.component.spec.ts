import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RobotPosition, StatusMessage } from '@buildmotion/toy-robot-service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { of } from 'rxjs';
import { BoardUIService } from './board-ui.service';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let mockUIService: jest.Mocked<BoardUIService>;

  const mockMessageService: jest.Mocked<MessageService> = {
    add: jest.fn(),
    clear: jest.fn(),
  } as unknown as jest.Mocked<MessageService>;

  beforeEach(async () => {
    mockUIService = {
      move: jest.fn(),
      placeRobot: jest.fn(),
      report: jest.fn(),
      turnLeft: jest.fn(),
      turnRight: jest.fn(),
      position$: of({ x: 0, y: 0, f: 'NORTH' } as RobotPosition),
      showRobot: jest.fn(),
      statusMessage$: of({ severity: 'success', summary: 'Success', detail: 'Test message' } as StatusMessage),
    } as unknown as jest.Mocked<BoardUIService>;

    await TestBed.configureTestingModule({
      imports: [TableModule],
      declarations: [BoardComponent],
      providers: [
        { provide: BoardUIService, useValue: mockUIService },
        { provide: MessageService, useValue: mockMessageService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize grid and direction on ngOnInit', () => {
    component.ngOnInit();
    expect(component.grid.length).toBe(5);
    expect(component.direction).toBe('NORTH');
  });

  it('should correctly determine if the robot is in a position', () => {
    // Removed unused 'placeRobotSpy'
    //TODO: MAKE UI SERVICE SPY TO HAVE BEEN CALLED `placeRobot`
    const placeRobotSpy = jest.spyOn(mockUIService, 'placeRobot');
    component.ngOnInit(); // or wherever `placeRobot` is supposed to be called
    component.placeRobot(0, 0);
    mockUIService.showRobot.mockReturnValue(true);

    expect(placeRobotSpy).toHaveBeenCalled();
    expect(component.isRobotHere(0, 0)).toBeTruthy();
  });

  it('should call move on the UI service', () => {
    const moveSpy = jest.spyOn(mockUIService, 'move');
    component.move();
    expect(moveSpy).toHaveBeenCalled();
  });

  it('should call placeRobot with correct parameters', () => {
    const placeRobotSpy = jest.spyOn(mockUIService, 'placeRobot');
    component.placeRobot(2, 3);
    expect(placeRobotSpy).toHaveBeenCalledWith({ x: 2, y: 3, f: 'NORTH' } as RobotPosition);
  });

  it('should call report on the UI service', () => {
    const reportSpy = jest.spyOn(mockUIService, 'report');
    component.report();
    expect(reportSpy).toHaveBeenCalled();
  });

  it('should call turnLeft on the UI service', () => {
    const turnLeftSpy = jest.spyOn(mockUIService, 'turnLeft');
    component.turnLeft();
    expect(turnLeftSpy).toHaveBeenCalled();
  });

  it('should call turnRight on the UI service', () => {
    const turnRightSpy = jest.spyOn(mockUIService, 'turnRight');
    component.turnRight();
    expect(turnRightSpy).toHaveBeenCalled();
  });
});
