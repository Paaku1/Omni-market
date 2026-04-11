import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserCredentials } from '../../interfaces/user-credentials';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly API_URL = 'https://localhost:7143';
  private userSubject = new BehaviorSubject<any>(null);

  supabase: SupabaseClient;

  constructor(private http: HttpClient) {
    // Replace with your actual Supabase Project URL and Anon Key
    this.supabase = createClient();
  }
  async loginWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // After login, Supabase redirects here.
        // Ensure this is in your "Allowed Redirect URLs" in Supabase Dashboard.
        redirectTo: 'http://localhost:4200/bidding'
      }
    });

    if (error) console.error('OAuth Error:', error.message);
  }

  login(credentials: UserCredentials){
    return this.http.post(`${this.API_URL}/login`,credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token',response.token);
        this.userSubject.next(response.user);
      })
    );
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch (e) {
      return true;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }
}
