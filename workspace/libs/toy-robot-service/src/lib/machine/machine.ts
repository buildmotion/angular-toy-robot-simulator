import { AnyActor, createActor } from 'xstate';
import { workflow } from './workflow';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Machine {
  actor!: AnyActor;

  constructor() {
    this.start();
  }

  start() {
    this.actor = createActor(workflow);
    this.actor.start();
  }
}
