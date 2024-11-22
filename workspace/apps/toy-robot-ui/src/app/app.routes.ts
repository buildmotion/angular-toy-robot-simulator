import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@buildmotion/robot-toy-components').then(
        (m) => m.ToyRobotComponentsModule
      ),
  },
];
