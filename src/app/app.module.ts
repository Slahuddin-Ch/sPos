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
import { MenuScreenComponent, ProductsComponent, SalesComponent } from './menu-screen';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { RequestInterceptor } from './_helpers/request.interceptor';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [						
    AppComponent,
    AlertComponent,
      DashboardComponent,
      MainScreenComponent,
        CategoryListComponent,
        PriceComponent,
        CartComponent,
      CheckoutScreenComponent,
      MenuScreenComponent,
        ProductsComponent,
        SalesComponent,
      LoginComponent
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
