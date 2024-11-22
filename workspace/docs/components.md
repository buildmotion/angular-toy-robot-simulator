# Components

## Board

Use the Nx generator to create a new Angular component named `board` in the `board` directory of the `toy-robot-components` library.

```bash
npx nx generate @nx/angular:component --name=board --directory=board --export=true --standalone=false --nameAndDirectoryFormat=as-provided --selector=robot --style=scss --no-interactive 
```

The output.

```bash
CREATE libs/toy-robot-components/src/lib/board/board.component.scss
CREATE libs/toy-robot-components/src/lib/board/board.component.html
CREATE libs/toy-robot-components/src/lib/board/board.component.spec.ts
CREATE libs/toy-robot-components/src/lib/board/board.component.ts
UPDATE libs/toy-robot-components/src/lib/toy-robot-components.module.ts
UPDATE libs/toy-robot-components/src/index.ts
UPDATE nx.json
UPDATE tsconfig.base.json
```

### Create Default Route for Board Component

To create a default route that lazy-loads a module in Angular, use the `loadChildren` property. This property lets you specify the path to the module you want to lazy-load. Here's a simple example to help you set up lazy-loading for a module named `ToyRobotComponentsModule`, which is located at the relative path `./path-to-module/ToyRobotComponentsModule`:

1. Start by defining your `appRoutes` using Angular's `Routes` array.
2. Add a route object that uses `loadChildren` to specify the path to the module.

Here's a sample code snippet. Notice that we are reference a library project named `@buildmotion/robot-toy-components`. The mapping to the library project is defined in the `tsconfig.base.json` file.

```typescript
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

```
