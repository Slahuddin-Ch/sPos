import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainScreenComponent, PriceComponent, CategoryListComponent, CartComponent } from './main-screen';
import { AlertComponent } from './_shared/alert/alert.component';
import { CheckoutScreenComponent } from './checkout-screen/checkout-screen.component';
import { MenuScreenComponent } from './menu-screen/menu-screen.component';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { RequestInterceptor } from './_helpers/request.interceptor';

@NgModule({
  declarations: [					
    AppComponent,
      DashboardComponent,
      MainScreenComponent,
        CategoryListComponent,
        PriceComponent,
        CartComponent,
    AlertComponent,
      CheckoutScreenComponent,
      MenuScreenComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
