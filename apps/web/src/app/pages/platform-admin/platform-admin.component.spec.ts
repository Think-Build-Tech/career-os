// apps/web/src/app/pages/platform-admin/platform-admin.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PlatformAdminComponent } from './platform-admin.component';
import { PlatformAdminStateService } from '../../services/platform-admin-state.service';
import { AuthSessionService } from '../../core/auth/auth-session.service';

describe('PlatformAdminComponent UI & State Harness', () => {
  let component: PlatformAdminComponent;
  let fixture: ComponentFixture<PlatformAdminComponent>;
  let state: PlatformAdminStateService;
  let auth: AuthSessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformAdminComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PlatformAdminStateService,
        AuthSessionService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformAdminComponent);
    component = fixture.componentInstance;
    state = TestBed.inject(PlatformAdminStateService);
    auth = TestBed.inject(AuthSessionService);
    fixture.detectChanges();
  });

  it('1. should create the PlatformAdminComponent and render console root', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.platform-console')).toBeTruthy();
    expect(compiled.querySelector('.brand-copy b')?.textContent).toContain('CareerOS');
  });

  it('2. should handle active page navigation state transitions', () => {
    expect(state.activePage()).toBe('overview');
    component.onNavClick('institutions');
    expect(state.activePage()).toBe('institutions');

    component.onNavClick('subscriptions');
    expect(state.activePage()).toBe('subscriptions');

    component.onNavClick('admins');
    expect(state.activePage()).toBe('admins');
  });

  it('3. should update search query signals for institutions and AI usage', () => {
    const instEvent = { target: { value: 'Sandip' } } as unknown as Event;
    component.onInstitutionSearch(instEvent);
    expect(state.institutionsSearchQuery()).toBe('Sandip');

    const aiEvent = { target: { value: '4821' } } as unknown as Event;
    component.onAiSearch(aiEvent);
    expect(state.aiTenantSearchQuery()).toBe('4821');
  });

  it('4. should populate college code and trigger resolution on quickSelectCollege', () => {
    spyOn(state, 'resolveCollege');
    component.quickSelectCollege('7314');
    expect(state.loginCodeInput()).toBe('7314');
    expect(state.resolveCollege).toHaveBeenCalledWith('7314');
  });

  it('5. should open confirmation modal when enabling maintenance mode', () => {
    state.platformSettings.update((s) => ({ ...s, maintenanceMode: false }));
    expect(component.isMaintenanceConfirmModalOpen()).toBe(false);

    component.onMaintenanceButtonClick();
    expect(component.isMaintenanceConfirmModalOpen()).toBe(true);

    component.closeMaintenanceConfirmModal();
    expect(component.isMaintenanceConfirmModalOpen()).toBe(false);
  });

  it('6. should confirm maintenance mode, toggle setting, and close modal', () => {
    state.platformSettings.update((s) => ({ ...s, maintenanceMode: false }));
    component.onMaintenanceButtonClick();
    expect(component.isMaintenanceConfirmModalOpen()).toBe(true);

    spyOn(state, 'toggleSetting');
    component.confirmEnableMaintenance();
    expect(component.isMaintenanceConfirmModalOpen()).toBe(false);
    expect(state.toggleSetting).toHaveBeenCalledWith('maintenanceMode');
  });

  it('7. should immediately disable maintenance mode without confirmation when already enabled', () => {
    state.platformSettings.update((s) => ({ ...s, maintenanceMode: true }));
    spyOn(state, 'toggleSetting');

    component.onMaintenanceButtonClick();
    expect(component.isMaintenanceConfirmModalOpen()).toBe(false);
    expect(state.toggleSetting).toHaveBeenCalledWith('maintenanceMode');
  });
});
