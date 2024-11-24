import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BoardComponent } from './board.component';
import { BoardUIService } from './board-ui.service';
import { Direction, RobotPosition, StatusMessage } from '@buildmotion/toy-robot-service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class MockBoardUIService {
  statusMessage$ = of({ severity: 'success', summary: 'Success', detail: 'Test message' } as StatusMessage);
  position$ = of({ x: 0, y: 0, f: 'NORTH' as Direction });

  showRobot(x: number, y: number): boolean {
    return x === 0 && y === 0;
  }

  move() {}
  placeRobot(position: RobotPosition) {}
  report() {}
  turnLeft() {}
  turnRight() {}
}

class MockMessageService {
  add(message: any) {}
  clear() {}
}

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let mockUIService: MockBoardUIService;
  let mockMessageService: MockMessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableModule],
      declarations: [BoardComponent],
      providers: [
        { provide: BoardUIService, useClass: MockBoardUIService },
        { provide: MessageService, useClass: MockMessageService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    mockUIService = TestBed.inject(BoardUIService);
    mockMessageService = TestBed.inject(MessageService) as any;
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
    const placeRobotSpy = jest.spyOn(mockUIService, 'placeRobot');
    component.placeRobot(0, 0);

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

  it.skip('should show a temporary message', async () => {
    const addSpy = jest.spyOn(mockMessageService, 'add');
    const clearSpy = jest.spyOn(mockMessageService, 'clear');

    component.ngOnInit(); // Triggers the subscription which calls `showTemporaryMessage`

    expect(addSpy).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Test message' });

    // Simulate time passing for setTimeout
    jest.advanceTimersByTime(2500);
    expect(clearSpy).toHaveBeenCalled();
  });
});
