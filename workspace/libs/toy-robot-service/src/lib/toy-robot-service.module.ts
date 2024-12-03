import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Machine } from './machine/machine';
import { LoggerService } from '@buildmotion/logger';

@NgModule({
  imports: [CommonModule],
  providers: [LoggerService, Machine],
})
export class ToyRobotServiceModule {}
