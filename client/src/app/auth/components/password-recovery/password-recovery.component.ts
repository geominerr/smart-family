import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
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

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthService } from '../../services/auth.service';
import { emailValidator } from '../../validators/email.validator';
import { IResetDto } from '../../models/auth.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
  imports: [
    AsyncPipe,
    NgClass,
    ReactiveFormsModule,
    RouterLink,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
})
export class PasswordRecoveryComponent implements OnDestroy {
  pendingResponceSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  subscription: Subscription | null = null;

  passwordResetForm: FormGroup;

  attempedSubmit: boolean = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.passwordResetForm = this.fb.group({
      email: ['as@as.d', [emailValidator]],
    });
  }

  getErrorMessage(name: 'email'): string | null {
    return this.passwordResetForm.controls?.[name]?.getError(name);
  }

  submitForm(): void {
    if (!this.attempedSubmit) {
      this.attempedSubmit = true;
    }

    if (this.passwordResetForm.invalid) {
      this.passwordResetForm.markAllAsTouched();

      return;
    }

    const email: IResetDto = this.passwordResetForm.getRawValue();
    this.pendingResponceSubject.next(true);
    this.subscription = this.authService
      .resetPassword(email)
      .pipe(
        tap(() => this.router.navigate(['signin'])),
        catchError((err) => {
          if (err?.status === 404) {
            this.showUserNotFoundError();
          }

          return throwError(() => err);
        }),
        finalize(() => this.pendingResponceSubject.next(false))
      )
      .subscribe();
  }

  showUserNotFoundError() {
    const { email } = this.passwordResetForm.controls;
    email.setErrors({ email: `User ${email.getRawValue()} not found` });
    email.markAsTouched();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
