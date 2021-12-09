import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { CheckoutScreenComponent } from './checkout-screen/checkout-screen.component';
import { MenuScreenComponent } from './menu-screen/menu-screen.component';
import { LoginComponent } from './login/login.component';
import { AdminScreenComponent } from './admin-screen/admin-screen.component';
import { AuthGuard } from './_helpers/auth.guard';
import { AdminGuard } from './_helpers/admin.guard';

const routes: Routes = [
  {path : '',          component: MainScreenComponent, canActivate: [AuthGuard]},
  {path : 'login',     component: LoginComponent},
  {path : 'dashboard', component: DashboardComponent},
  {path : 'main',      component: MainScreenComponent, canActivate: [AuthGuard]},
  {path : 'checkout',  component: CheckoutScreenComponent, canActivate: [AuthGuard]},
  {path : 'menu',      component: MenuScreenComponent, canActivate: [AuthGuard]},
  {path : 'admin',     component: AdminScreenComponent, canActivate: [AdminGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
