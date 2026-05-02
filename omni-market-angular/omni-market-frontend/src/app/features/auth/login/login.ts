import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Card } from '../../../shared/card/card';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [ReactiveFormsModule, Card, RouterLink],
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
  ) {}

  // app/features/auth/login/login.ts
  ngOnInit() {
    this.initForm(); // Your existing form init logic

    // Listen for the session to navigate, but let the service handle storage
    this.authService.supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async onGoogleLogin() {
    try {
      await this.authService.loginWithGoogle();
    } catch (err) {
      alert('Login failed. Check your console.');
    }
  }

  initForm() {
    // Initialize the form with validation rules
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Call the service we discussed to talk to the .NET Gateway
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successful');
        // Navigate to the bidding dashboard after successful login
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password. Please try again.';
        console.error('Login failed', err);
      },
    });
  }
}
