import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainScreenComponent, QuantityComponent, ProductListComponent } from './main-screen';


@NgModule({
  declarations: [			
    AppComponent,
      DashboardComponent,
      MainScreenComponent,
        QuantityComponent,
        ProductListComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
