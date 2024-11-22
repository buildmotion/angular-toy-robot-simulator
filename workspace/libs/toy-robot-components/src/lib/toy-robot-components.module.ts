import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toyRobotComponentsRoutes } from './lib.routes';
import { BoardComponent } from './board/board.component';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(toyRobotComponentsRoutes),
    ButtonModule,
    TableModule,
    MessagesModule,
  ],
  declarations: [BoardComponent],
  exports: [BoardComponent],
  providers: [MessageService],
})
export class ToyRobotComponentsModule {}
