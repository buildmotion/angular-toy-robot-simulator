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
