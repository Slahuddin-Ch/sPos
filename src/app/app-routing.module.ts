import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { CheckoutScreenComponent } from './checkout-screen/checkout-screen.component';
import { MenuScreenComponent } from './menu-screen/menu-screen.component';

const routes: Routes = [
  {path : '',          component:MainScreenComponent},
  {path : 'dashboard', component:DashboardComponent},
  {path : 'main',      component:MainScreenComponent},
  {path : 'checkout',  component:CheckoutScreenComponent},
  {path : 'menu',      component:MenuScreenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
