import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { toyRobotComponentsRoutes } from './lib.routes';

import { RobotMachineService } from '@buildmotion/toy-robot-service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { BoardUIService } from './board/board-ui.service';
import { SquareComponent } from './square/square.component';
import { LoggerService } from '@buildmotion/logger';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(toyRobotComponentsRoutes), ButtonModule, TableModule, MessagesModule],
  declarations: [BoardComponent, SquareComponent],
  exports: [BoardComponent],
  providers: [LoggerService, MessageService, BoardUIService, RobotMachineService],
})
export class ToyRobotComponentsModule {}
