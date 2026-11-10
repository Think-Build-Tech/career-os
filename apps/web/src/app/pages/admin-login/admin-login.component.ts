import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticatedSession, AuthSessionService } from '../../core/auth/auth-session.service';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  private readonly auth = inject(AuthSessionService);
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);

  adminEmail = '';
  adminPassword = '';
  isAuthenticating = false;
  bootstrapRequired = false;
  errorMessage = '';

  authenticateAdmin(): void {
    if (!this.adminEmail.trim() || !this.adminPassword) {
      this.errorMessage = 'Email and password are required.';
      return;
    }
    this.isAuthenticating = true;
    this.bootstrapRequired = false;
    this.errorMessage = '';
    this.authApi.loginAdmin(this.adminEmail.trim(), this.adminPassword).subscribe({
      next: (session) => this.finishAuthentication(session),
      error: (error) => {
        this.isAuthenticating = false;
        this.bootstrapRequired = error?.error?.code === 'ADMIN_BOOTSTRAP_REQUIRED';
        this.errorMessage = error?.error?.message || 'Administrator authentication failed.';
      },
    });
  }

  bootstrapAdmin(): void {
    this.isAuthenticating = true;
    this.errorMessage = '';
    this.authApi.bootstrapAdmin(this.adminEmail.trim(), this.adminPassword).subscribe({
      next: (session) => this.finishAuthentication(session),
      error: (error) => {
        this.isAuthenticating = false;
        this.errorMessage = error?.error?.message || 'The first administrator could not be initialized.';
      },
    });
  }

  private finishAuthentication(session: AuthenticatedSession): void {
    this.auth.setSessionOnLogin(session);
    this.router.navigate(['/admin']);
  }
}
