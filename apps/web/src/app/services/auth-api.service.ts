import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthenticatedSession } from '../core/auth/auth-session.service';

interface AuthResponse {
  success: boolean;
  session: AuthenticatedSession;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  loginAdmin(email: string, password: string): Observable<AuthenticatedSession> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/admin/login`, { email, password })
      .pipe(map((response) => response.session));
  }

  bootstrapAdmin(email: string, password: string): Observable<AuthenticatedSession> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/admin/bootstrap`, { email, password })
      .pipe(map((response) => response.session));
  }

  loginStudent(collegeCode: string, email: string, password: string): Observable<AuthenticatedSession> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/student/login`, {
        college_code: collegeCode,
        email,
        password,
      })
      .pipe(map((response) => response.session));
  }
}
