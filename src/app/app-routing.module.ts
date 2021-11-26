import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainScreenComponent } from './main-screen/main-screen.component';

const routes: Routes = [
  {path : '', component:MainScreenComponent},
  {path : 'dashboard', component:DashboardComponent},
  {path : 'main', component:MainScreenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
