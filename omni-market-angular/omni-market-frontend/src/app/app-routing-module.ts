import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiddingDashboard } from './components/bidding-dashboard/bidding-dashboard';
import { Login } from './features/auth/login/login';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthCallback } from './features/auth/auth-callback/auth-callback';
import { Signup } from './features/auth/signup/signup';
import { BidDetails } from './features/bid-details/bid-details';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup }, // Add this
  { path: 'dashboard', component: BiddingDashboard, canActivate: [AuthGuard] },
  { path: 'auth/callback', component: AuthCallback },
  { path: 'bid/:id', component: BidDetails, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
