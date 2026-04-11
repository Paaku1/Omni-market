import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiddingDashboard } from './components/bidding-dashboard/bidding-dashboard';
import { Login } from './features/auth/login/login';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {path:'dashboard', component:BiddingDashboard, canActivate: [AuthGuard]},
  {path:'login', component: Login}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
