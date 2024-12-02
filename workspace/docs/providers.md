# Providers

Providers allow you to inject services into your components, directives, and other services. Providers are a fundamental part of Angular development. This section will cover the creation of providers that are used throughout the application. Providers have `scope` and `lifetime` characteristics that are important to understand when designing and implementing your services.

> Note: any module that is lazy-loaded will have its own instance of the services that are provided in that module. This is important to understand when designing your services.

## Logger

Create a library project with a service to log messages to the console. The `Logger` service will be provided in the `AppModule` and the `ToyRobotComponentsModule` - as well as the `toy-robot-service` project.

> The intent of this service is to demonstrate the lifetime and scope of a service that is provided in the `AppModule` and a lazy-loaded module. Where different instances of the service are initialized and used.

```typescript
nx g @nx/angular:library --name=logger --directory=libs/shared/logger --publishable=true --importPath=@buildmotion/logger --projectNameAndRootFormat=as-provided --standalone=false --style=scss

nx g @schematics/angular:service --name=logger --project=logger
```

## ErrorHandler

We will create an `ErrorHandler` service that will be provided in the `AppModule`. The `ErrorHandler` service will use the `Logger` service to log error messages and stack traces to the console.

> Highlander Rule: There can only be one `ErrorHandler` service in the application. The `providedIn` property is set to `root` to ensure that the service is provided in the `AppModule`.

```typescript
nx g @nx/angular:library --name=error-handler --directory=libs/shared/error-handler --publishable=true --importPath=@buildmotion/error-handler --projectNameAndRootFormat=as-provided --standalone=false --style=scss

nx g @schematics/angular:service --name=error-handler --project=error-handler
```

## Provider Identifier

Each service that is provided contains an `id` property that is used to identify the instance of the service. This is useful for debugging and understanding the lifetime of the service. The `id` property is generated using the `uuid` library. When an application event occurs that loads a module (e.g., lazy loading a component from a UI component library), the same `Logger` service that is provided in this project will initialize - however, it will be a different instance of the service. This is important to understand when designing your services.

```bash

```typescript
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'any',
})
export class LoggerService {
  id: string;

  constructor() {
    this.id = uuidv4();

    this.log(`Logger: ${this.id}; Initialized`);
  }

  log(message: string): void {
    console.log(message);
  }
}
```

## Sequence of Loading Providers

The AppModule has a collection of `providers`. These will load first.

```typescript
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandlerService } from '@buildmotion/error-handler';
import { LoggerService } from '@buildmotion/logger';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, RouterModule.forRoot(appRoutes)],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
    ErrorHandlerService,
    LoggerService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

When the application initializes, the top-level (i.e., `root` level) providers will load first. The `Logger` and `ErrorHandler` services will initialize first. The services log a message to the console with their unique identifier value.

```typescript
Logger: 8b14d001-6971-4a00-9d33-948841c58584; Initialized
ErrorHandler: a5426216-78c1-4d2e-b507-6f12fe857f69; Initialized
```

### Default Route

The application has a default route that loads a target component from a lazy-loaded module.

```typescript
// apps/toy-robot-ui/src/app/app.routes.ts
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

This module also provides the `LoggerService` and `ErrorHandlerService`. When the component is loaded, the services will initialize again. The `Logger` service will log a message to the console with its unique identifier value.

```typescript
Logger: 94c6276f-bc09-4000-8b85-3e849259fd7c; Initialized
```

Please note that the `ErrorHandlerService` did not log a message to the console. This is because the `ErrorHandlerService` is not used in the `ToyRobotComponentsModule`. The `ErrorHandlerService` is provided in the `AppModule` and is available to all components and services in the application. Therefore, the `ErrorHandlerService` is not initialized again when the `ToyRobotComponentsModule` is loaded.

```typescript
// libs/toy-robot-components/src/lib/toy-robot-components.module.ts
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
```

### Error Event

When the component library (i.e., `ToyRobotComponentsModule`) throws an error, the `ErrorHandlerService` will log a message to the console with its unique identifier value. This value is the same as the value that was logged when the `ErrorHandlerService` was initialized in the `AppModule`.

> Note: you can place a debug point in the `LoggerService` and see the stack trace of the error event. When the call to the `log` method is made, the stack trace will be captured and logged to the console. The `ErrorHandlerService` will log the error message and the stack trace to the console.

The instance of the `LoggerService` used in this event is the one initialized in the `AppModule` of the application. The same service, however a different instance.

```typescript
Logger: 8b14d001-6971-4a00-9d33-948841c58584; Message: Invalid Move: Stay on the board - choose a different move. Current Position: x=0, y=1, f=WEST
```

## Shared Data

If you have a service that needs to share data or information, the scope and lifetime of the service are important to understand.

- **Where**: where services are provided in the application. The `root` value indicates that the service is provided in the `AppModule`. The `any` value indicates that the service is provided in the module that is loaded.
- **When**: when the service is initialized. The `root` value indicates that the service is initialized when the application starts. The `any` value indicates that an instance of the service is initialized when the module is loaded.
- **What**: Different events may trigger the usage of different instances.
