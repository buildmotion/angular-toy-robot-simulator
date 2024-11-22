import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toyRobotComponentsRoutes } from './lib.routes';
import { BoardComponent } from './board/board.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(toyRobotComponentsRoutes)],
  declarations: [BoardComponent],
  exports: [BoardComponent],
})
export class ToyRobotComponentsModule {}
