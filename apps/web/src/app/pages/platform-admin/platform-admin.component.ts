// apps/web/src/app/pages/platform-admin/platform-admin.component.ts

import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  PlatformAdminStateService,
  ADMIN_PAGE_NAMES,
} from '../../services/platform-admin-state.service';

import { AuthSessionService } from '../../core/auth/auth-session.service';
import { AdminPageId } from '../../models/platform-admin.model';

@Component({
  selector: 'app-platform-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './platform-admin.component.html',
  styleUrls: ['./platform-admin.component.css'],
})
export class PlatformAdminComponent implements OnInit, OnDestroy {
  readonly state = inject(PlatformAdminStateService);
  readonly auth = inject(AuthSessionService);

  /**
   * UI-only state.
   *
   * This belongs to the component because it only controls
   * whether the confirmation dialog is visible.
   */
  readonly isMaintenanceConfirmModalOpen = signal(false);

  private readonly hashListener = () => {
    const raw = window.location.hash.replace('#', '') as AdminPageId;

    if (ADMIN_PAGE_NAMES[raw]) {
      this.state.activePage.set(raw);
    }
  };

  ngOnInit(): void {
    window.addEventListener('hashchange', this.hashListener);
    this.hashListener();
  }

  ngOnDestroy(): void {
    window.removeEventListener('hashchange', this.hashListener);
  }

  /**
   * Called when the Enable / Disable maintenance button is clicked.
   */
  onMaintenanceButtonClick(): void {
    const maintenanceEnabled =
      this.state.platformSettings().maintenanceMode;

    /**
     * If maintenance mode is already enabled,
     * disable it immediately.
     *
     * We only need confirmation before enabling it.
     */
    if (maintenanceEnabled) {
      this.state.toggleSetting('maintenanceMode');
      return;
    }

    /**
     * Maintenance is currently disabled,
     * so ask for confirmation.
     */
    this.isMaintenanceConfirmModalOpen.set(true);
  }

  /**
   * User cancelled the operation.
   */
  closeMaintenanceConfirmModal(): void {
    this.isMaintenanceConfirmModalOpen.set(false);
  }

  /**
   * User confirmed enabling maintenance mode.
   */
  confirmEnableMaintenance(): void {
    this.isMaintenanceConfirmModalOpen.set(false);

    this.state.toggleSetting('maintenanceMode');
  }

  onNavClick(page: AdminPageId): void {
    this.state.navigateTo(page);
  }

  onInstitutionSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.state.institutionsSearchQuery.set(val);
  }

  onAiSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.state.aiTenantSearchQuery.set(val);
  }

  quickSelectCollege(code: string): void {
    this.state.loginCodeInput.set(code);
    this.state.resolveCollege(code);
  }
}