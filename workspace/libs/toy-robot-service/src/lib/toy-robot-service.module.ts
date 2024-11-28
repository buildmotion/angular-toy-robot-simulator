import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Machine } from './machine/machine';

@NgModule({
  imports: [CommonModule],
  providers: [Machine],
})
export class ToyRobotServiceModule {}
