import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminPageId } from '../../models/platform-admin.model';
import {
  ADMIN_PAGE_NAMES,
  PlatformAdminStateService,
} from '../../services/platform-admin-state.service';

@Component({
  selector: 'app-platform-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './platform-admin.component.html',
  styleUrls: ['./platform-admin.component.css'],
})
export class PlatformAdminComponent implements OnInit {
  readonly state = inject(PlatformAdminStateService);
  readonly auth = this.state.auth;

  ngOnInit(): void {
    // Data refreshed on component mount
    this.state.refreshAllData();
  }

  onNavClick(page: AdminPageId): void {
    this.state.navigateTo(page);
  }

  onInstitutionSearch(event: Event): void {
    this.state.institutionsSearchQuery.set((event.target as HTMLInputElement).value);
  }

  onAiSearch(event: Event): void {
    this.state.aiTenantSearchQuery.set((event.target as HTMLInputElement).value);
  }

  quickSelectCollege(code: string): void {
    this.state.loginCodeInput.set(code);
    this.state.resolveCollege(code);
  }

  logout(): void {
    this.auth.clearSessionOnLogout();
  }

  initials(name?: string): string {
    if (!name) return '—';
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }

  formatNumber(value: unknown): string {
    const number = Number(value ?? 0);
    return Number.isFinite(number) ? new Intl.NumberFormat('en-IN').format(number) : '—';
  }

  formatCurrency(value: unknown): string {
    const number = Number(value ?? 0);
    return Number.isFinite(number)
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(number)
      : '—';
  }

  statusClass(status?: string): string {
    const value = String(status || '').toUpperCase();
    if (['ACTIVE', 'OPERATIONAL', 'HEALTHY', 'COMPLETED', 'SUCCESS', 'RECORDED'].includes(value)) return 'green';
    if (['FAILED', 'OUTAGE', 'UNAVAILABLE', 'ATTENTION', 'MIGRATION_ISSUE'].includes(value)) return 'red';
    if (['PROVISIONING', 'RUNNING', 'QUEUED', 'DEGRADED', 'CREATING', 'INVITED'].includes(value)) return 'amber';
    return 'gray';
  }
}
