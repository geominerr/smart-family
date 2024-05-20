import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatErrorHarness } from '@angular/material/form-field/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { AuthService } from '../../services/auth.service';
import { SigninComponent } from './signin.component';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let loader: HarnessLoader;
  let ngZone: NgZone;
  const mockAuthService = {
    login: () => of({}),
  };
  const submitButtonSelector = '.signin-form__submit-button';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        SigninComponent,
        MatIconTestingModule,
        RouterTestingModule,
      ],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    ngZone = TestBed.inject(NgZone);
  });

  it('should show error messages if the fields are empty', async () => {
    const amountErrors = 2;
    const matErrorsBefore = await loader.getAllHarnesses(MatErrorHarness);
    expect(matErrorsBefore.length).toBe(0);

    const invalidFormData = {
      email: '',
      password: '',
      remember: [false],
    };
    component.signinForm.setValue(invalidFormData);
    component.signinForm.markAllAsTouched();

    const matErrors = await loader.getAllHarnesses(MatErrorHarness);

    expect(matErrors.length).toBe(amountErrors);
  });

  it('should call the login after the click if the form is valid', () => {
    const loginSpyon = jest.spyOn(mockAuthService, 'login');
    const submitButton = fixture.debugElement.query(
      By.css(submitButtonSelector)
    );
    const validFormData = {
      email: 'email@email.com',
      password: 'PassW0rd1@',
      remember: [false],
    };
    component.signinForm.setValue(validFormData);

    ngZone.run(() => {
      submitButton.triggerEventHandler('click', null);

      expect(loginSpyon).toHaveBeenCalledWith(validFormData);
    });
  });

  it('should disabled submit button after the click if the form is invalid', () => {
    const submitButton = fixture.debugElement.query(
      By.css(submitButtonSelector)
    );
    const invalidFormData = {
      email: 'invalid_email',
      password: 'invalid_password',
      remember: [false],
    };
    component.signinForm.setValue(invalidFormData);

    ngZone.run(() => {
      submitButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(submitButton.nativeElement.disabled).toBeTruthy();
    });
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
    const formWrapper = fixture.debugElement.query(By.css('.signin-wrapper'));
    expect(formWrapper.classes).not.toHaveProperty(disabledClass);

    component.pendingResponceSubject.next(true);
    fixture.detectChanges();

    expect(formWrapper.classes).toHaveProperty(disabledClass);
  });
});
