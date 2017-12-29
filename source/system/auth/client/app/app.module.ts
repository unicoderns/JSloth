import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SecondComponent } from './second/second.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SecondComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
