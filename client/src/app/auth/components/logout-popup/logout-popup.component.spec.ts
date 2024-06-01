import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { MatDialogRef } from '@angular/material/dialog';

import { AuthService } from '../../services/auth.service';
import { LogoutPopupComponent } from './logout-popup.component';

describe('LogoutPopupComponent', () => {
  let fixture: ComponentFixture<LogoutPopupComponent>;
  const mockAuthService = {
    logout: () => of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, LogoutPopupComponent],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutPopupComponent);
    fixture.detectChanges();
  });

  it('should call the logout after the clicking "Accept" button', () => {
    const logoutSpyon = jest.spyOn(mockAuthService, 'logout');
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);

    const acceptButton = buttons[1];

    acceptButton.triggerEventHandler('click', {});

    expect(logoutSpyon).toHaveBeenCalled();
  });
});
