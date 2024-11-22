import { Route } from '@angular/router';
import { BoardComponent } from './board/board.component';

export const toyRobotComponentsRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: BoardComponent },
];
