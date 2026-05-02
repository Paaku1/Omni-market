import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-auth-callback',
  template: `<p>Signing you in...</p>`,
})
export class AuthCallback implements OnInit {
  constructor(private authService: Auth, private router: Router) {}

  async ngOnInit() {
    // This forces Supabase to parse the token from the URL fragment
    const { data, error } = await this.authService.supabase.auth.getSession();

    if (data.session) {
      localStorage.setItem('token', data.session.access_token);
      this.router.navigate(['/dashboard']);
    } else {
      console.error('No session found after OAuth redirect', error);
      this.router.navigate(['/login']);
    }
  }
}
