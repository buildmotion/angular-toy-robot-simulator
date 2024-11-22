import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toyRobotComponentsRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(toyRobotComponentsRoutes)],
})
export class ToyRobotComponentsModule {}
