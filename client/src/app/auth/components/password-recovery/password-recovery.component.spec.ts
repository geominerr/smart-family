import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { PasswordRecoveryComponent } from './password-recovery.component';

describe('PasswordRecoveryComponent', () => {
  let component: PasswordRecoveryComponent;
  let fixture: ComponentFixture<PasswordRecoveryComponent>;
  let ngZone: NgZone;
  const mockAuthService = {
    resetPassword: () => of({}),
  };
  const submitButtonSelector = '.password-recovery-form__submit-button';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        PasswordRecoveryComponent,
        RouterTestingModule,
      ],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    ngZone = TestBed.inject(NgZone);
  });

  it('should show error message if the field is empty', () => {
    const matErrorSelector = 'mat-error';
    const submitButton = fixture.debugElement.query(
      By.css(submitButtonSelector)
    );
    const invalidFormData = {
      email: '',
    };
    component.passwordResetForm.setValue(invalidFormData);

    submitButton.triggerEventHandler('click', {});
    fixture.detectChanges();

    const matErrors = fixture.debugElement.queryAll(By.css(matErrorSelector));
    expect(matErrors.length).toBe(1);
  });

  it('should call the resetPassword after the click if the form is valid', () => {
    const resetPasswordSpyon = jest.spyOn(mockAuthService, 'resetPassword');
    const submitButton = fixture.debugElement.query(
      By.css(submitButtonSelector)
    );
    const validFormData = {
      email: 'valid@email.com',
    };
    component.passwordResetForm.setValue(validFormData);

    ngZone.run(() => {
      submitButton.triggerEventHandler('click', {});

      expect(resetPasswordSpyon).toHaveBeenCalledWith(validFormData);
    });
  });
});
