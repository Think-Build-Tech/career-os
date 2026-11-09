import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthSessionService } from '../../core/auth/auth-session.service';
import { CollegeResolutionResult, TenantDto } from '../../models/platform-admin.model';
import { AuthApiService } from '../../services/auth-api.service';
import { PlatformAdminApiService } from '../../services/platform-admin-api.service';

@Component({
  selector: 'app-college-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './college-login.component.html',
  styleUrls: ['./college-login.component.css'],
})
export class CollegeLoginComponent implements OnInit {
  private readonly auth = inject(AuthSessionService);
  private readonly authApi = inject(AuthApiService);
  private readonly platformApi = inject(PlatformAdminApiService);
  private readonly router = inject(Router);

  readonly colleges = signal<TenantDto[]>([]);
  readonly collegeCode = signal('');
  readonly isResolving = signal(false);
  readonly resolvedTenant = signal<CollegeResolutionResult | null>(null);
  readonly resolutionError = signal<string | null>(null);
  studentIdOrEmail = '';
  studentPassword = '';
  loginError = '';
  isLoggingIn = false;

  ngOnInit(): void {
    this.platformApi.getResolvableColleges().subscribe({
      next: (colleges) => this.colleges.set(colleges),
      error: (error) => this.resolutionError.set(error?.error?.message || 'Institutions could not be loaded from the API.'),
    });
  }

  resolveCollege(code: string): void {
    const value = code.trim();
    if (!value) {
      this.resolutionError.set('Enter your college code or slug.');
      return;
    }
    this.collegeCode.set(value);
    this.isResolving.set(true);
    this.resolutionError.set(null);
    this.resolvedTenant.set(null);
    this.platformApi.resolveCollegeTenant(value).subscribe({
      next: (result) => {
        this.isResolving.set(false);
        this.resolvedTenant.set(result);
      },
      error: (error) => {
        this.isResolving.set(false);
        this.resolutionError.set(error?.error?.message || 'Institution could not be resolved.');
      },
    });
  }

  onCodeKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.resolveCollege(this.collegeCode());
  }

  selectQuickCollege(college: TenantDto): void {
    this.resolveCollege(college.college_code);
  }

  loginAsDemoStudent(): void {
    const resolved = this.resolvedTenant();
    const collegeCode = resolved?.tenant?.college_code || this.collegeCode() || '4821';
    this.isLoggingIn = true;
    this.loginError = '';

    this.authApi.loginStudent(collegeCode, 'aarav.sharma@sitrc.ac.in', 'Student@Pass123!').subscribe({
      next: (session) => {
        this.isLoggingIn = false;
        this.auth.setSessionOnLogin(session);
        this.router.navigate(['/portal']);
      },
      error: () => {
        this.isLoggingIn = false;
        this.auth.loginAsCollegeStudent(collegeCode, 'aarav.sharma@sitrc.ac.in');
      },
    });
  }

  onSubmitLogin(): void {
    const resolved = this.resolvedTenant();
    if (!resolved?.tenant) {
      this.loginError = 'Verify your institution before signing in.';
      return;
    }
    if (!this.studentIdOrEmail.trim() || !this.studentPassword) {
      this.loginError = 'Email and password are required.';
      return;
    }

    this.isLoggingIn = true;
    this.loginError = '';
    this.authApi.loginStudent(resolved.tenant.college_code, this.studentIdOrEmail.trim(), this.studentPassword).subscribe({
      next: (session) => {
        this.isLoggingIn = false;
        this.auth.setSessionOnLogin(session);
        this.router.navigate(['/portal']);
      },
      error: (error) => {
        this.isLoggingIn = false;
        this.loginError = error?.error?.message || 'Student authentication failed.';
      },
    });
  }
}
