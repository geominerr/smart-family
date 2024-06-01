import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { MatIconTestingModule } from '@angular/material/icon/testing';

import { AuthService } from '../../services/auth.service';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let ngZone: NgZone;
  const mockAuthService = {
    signup: () => of({}),
  };
  const submitButtonSelector = '.signup-form__submit-button';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        SignupComponent,
        RouterTestingModule,
        MatIconTestingModule,
      ],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    ngZone = TestBed.inject(NgZone);
    fixture.detectChanges();
  });

  it('should show error messages if the fields are empty and not confirm terms of service', () => {
    const matErrorSelector = 'mat-error';
    const submitButton = fixture.debugElement.query(
      By.css(submitButtonSelector)
    );
    const invalidFormData = {
      username: '',
      email: '',
      password: '',
    };
    component.termsAccepted = false;
    component.signupForm.setValue(invalidFormData);

    submitButton.triggerEventHandler('click', {});
    fixture.detectChanges();

    const matErrors = fixture.debugElement.queryAll(By.css(matErrorSelector));
    expect(matErrors.length).toBe(4);
  });

  it('should call the signup after the click if the form is valid and confirm terms of service', () => {
    const signupSpyon = jest.spyOn(mockAuthService, 'signup');
    const submitButton = fixture.debugElement.query(
      By.css(submitButtonSelector)
    );
    const validFormData = {
      username: 'Jim',
      email: 'jim@gmail.com',
      password: 'Jim777@a',
    };
    component.termsAccepted = true;
    component.signupForm.setValue(validFormData);

    ngZone.run(() => {
      submitButton.triggerEventHandler('click', {});

      expect(signupSpyon).toHaveBeenCalledWith(validFormData);
    });
  });

  it('should disabled submit button after the click if the form is invalid', () => {
    const submitButton = fixture.debugElement.query(
      By.css(submitButtonSelector)
    );
    const invalidFormData = {
      username: '777',
      email: 'invalid_email',
      password: 'invalid_password',
    };
    component.termsAccepted = true;
    component.signupForm.setValue(invalidFormData);

    submitButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it('should disabled submit button after the click if the form is valid and not confirm terms of service', () => {
    const submitButton = fixture.debugElement.query(
      By.css(submitButtonSelector)
    );
    const validFormData = {
      username: 'Jim',
      email: 'jim@gmail.com',
      password: 'Jim777@a',
    };
    component.termsAccepted = false;
    component.signupForm.setValue(validFormData);

    submitButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it('should disabled submit button if pending response', () => {
    const submitButton = fixture.debugElement.query(
      By.css(submitButtonSelector)
    );
    expect(submitButton.nativeElement.disabled).toBeFalsy();

    component.pendingResponceSubject.next(true);
    fixture.detectChanges();

    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it('should add css class "disabled" for form if pending response', () => {
    const disabledClass = 'disabled';
    const formWrapper = fixture.debugElement.query(By.css('.signup-wrapper'));
    expect(formWrapper.classes).not.toHaveProperty(disabledClass);

    component.pendingResponceSubject.next(true);
    fixture.detectChanges();

    expect(formWrapper.classes).toHaveProperty(disabledClass);
  });
});
