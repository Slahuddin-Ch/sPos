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
import { MenuScreenComponent, ProductsComponent, SalesComponent, ReportsComponent } from './menu-screen';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { RequestInterceptor } from './_helpers/request.interceptor';
import { LoginComponent } from './login/login.component';
import { SaleReceiptComponent } from './_modals/sale-receipt/sale-receipt.component';
import { FooterComponent } from './_shared/footer/footer.component';
// Admin Components
import { AdminScreenComponent, AdminManageUsersComponent, AdminManageSalesComponent, AdminSettingsComponent } from './admin-screen';
import { DataTablesModule } from 'angular-datatables';

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
        ReportsComponent,
      LoginComponent,
      SaleReceiptComponent,
      AdminScreenComponent,
        AdminManageUsersComponent,
        AdminManageSalesComponent,
        AdminSettingsComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTablesModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
