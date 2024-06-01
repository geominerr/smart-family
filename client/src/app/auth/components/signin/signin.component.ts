import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import {
  BehaviorSubject,
  Subscription,
  catchError,
  finalize,
  tap,
  throwError,
} from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { environment } from '@root/environments/environment';

import { SvgIconsModule } from '@app/shared/modules/svg-icons.module';
import { emailValidator } from '@app/shared/validators/email.validator';
import { passwordValidator } from '@app/shared/validators/password.validator';
import { AuthService } from '../../services/auth.service';
import { ILoginDto } from '../../models/auth.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  imports: [
    AsyncPipe,
    NgClass,
    ReactiveFormsModule,
    RouterLink,
    RouterModule,
    SvgIconsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
  ],
})
export class SigninComponent implements OnDestroy {
  urlGoogleAuth: string = environment.urlGoogleAuth;

  pendingResponceSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  subscription: Subscription | null = null;

  signinForm: FormGroup;

  attempedSubmit: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [emailValidator]],
      password: ['', [passwordValidator]],
      remember: [false],
    });
  }

  getErrorMessage(name: 'email' | 'password'): string | null {
    return this.signinForm.controls?.[name]?.getError(name);
  }

  submitForm(): void {
    if (!this.attempedSubmit) {
      this.attempedSubmit = true;
    }

    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();

      return;
    }

    const user: ILoginDto = this.signinForm.getRawValue();

    this.pendingResponceSubject.next(true);
    this.subscription = this.authService
      .login(user)
      .pipe(
        tap(() => this.router.navigate(['/'])),
        catchError((err) => {
          if (err?.status === 403) {
            this.showIncorrectPasswordError();
          }

          if (err?.status === 404) {
            this.showUserNotFoundError();
          }

          return throwError(() => err);
        }),
        finalize(() => this.pendingResponceSubject.next(false))
      )
      .subscribe();
  }

  showIncorrectPasswordError() {
    const { password } = this.signinForm.controls;
    password.setErrors({ password: 'Incorrect password' });
    password.markAsTouched();
  }

  showUserNotFoundError() {
    const { email } = this.signinForm.controls;
    email.setErrors({ email: `User ${email.getRawValue()} not found` });
    email.markAsTouched();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
