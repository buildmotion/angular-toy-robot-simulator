import { Injectable } from '@angular/core';
import { RobotMachineService, RobotPosition, StatusMessage } from '@buildmotion/toy-robot-service';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { isSubscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root',
})
export class BoardUIService {
  private isValidSubject = new BehaviorSubject<boolean>(false);
  isValid$ = this.isValidSubject.asObservable();

  statusMessage$!: Observable<StatusMessage>;

  constructor(private robotService: RobotMachineService, public messageService: MessageService) {
    this.initialize();
  }

  isValidCell(x: number, y: number) {
    this.robotService.isValidCell(x, y);
  }

  updateRobotPosition(robotPosition: RobotPosition): boolean {
    let isUpdated = false;
    // 1. validate position
    if (this.robotService.isValidCell(robotPosition.x, robotPosition.y)) {
      // 2. Update the robot's position
      this.robotService.updateRobotPosition(robotPosition);
      isUpdated = true;
    }
    return isUpdated;
  }

  private initialize() {
    this.statusMessage$ = this.robotService.statusMessage$;

    this.robotService.isValidCell$.subscribe((isValid) => {
      this.isValidSubject.next(isValid);
    });
  }
}
