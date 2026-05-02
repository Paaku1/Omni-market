import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserCredentials } from '../../interfaces/user-credentials';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly API_URL = environment.gatewayUrl;
  private userSubject = new BehaviorSubject<any>(null);
  public user$: Observable<any> = this.userSubject.asObservable();
  supabase: SupabaseClient;

  constructor(private http: HttpClient) {
    this.supabase = createClient(
      'https://jktxgbkbyvyqhkyvfdal.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdHhnYmtieXZ5cWhreXZmZGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2Mzc0OTQsImV4cCI6MjA5MTIxMzQ5NH0.ItUx8dOH1UWPh-A2ZbynFJhp12Lu4XIwUB3XoI6GfTU'
    );
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.setItem('token', session.access_token);
        this.userSubject.next(session.user);
      }
    });
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        this.userSubject.next(session.user);
        localStorage.setItem('token', session.access_token);
      } else {
        this.userSubject.next(null);
        localStorage.removeItem('token');
      }
    });
  }

  async loginWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:4200/auth/callback' // ✅ changed
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

  register(user: any) {
    return this.http.post(`${this.API_URL}/register`, user).pipe(
      catchError((error) => {
        // status 0 usually means the server is not reachable (Gateway is down)
        if (error.status === 0) {
          return throwError(() => new Error('Cannot authenticate now, please try again later.'));
        }
        return throwError(() => error);
      })
    );
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getCurrentUserId(): string | null {
    const user = this.userSubject.value;
    return user ? user.id : null;
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.userSubject.next(null);
    localStorage.removeItem('token');
  }

}
