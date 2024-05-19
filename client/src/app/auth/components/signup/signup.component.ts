import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { environment } from '@root/environments/environment';

import { AuthService } from '../../services/auth.service';
import { TermsPopupComponent } from '../terms-popup/terms-popup.component';
import { SvgIconsModule } from '../../../shared/modules/svg-icons.module';
import { emailValidator } from '../../validators/email.validator';
import { passwordValidator } from '../../validators/password.validator';
import { usernameValidator } from '../../validators/username.validator';
import { ISignupDto } from '../../models/auth.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [
    AsyncPipe,
    NgClass,
    NgIf,
    ReactiveFormsModule,
    RouterModule,
    SvgIconsModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    TermsPopupComponent,
  ],
})
export class SignupComponent implements OnDestroy {
  urlGoogleAuth: string = environment.urlGoogleAuth;

  pendingResponceSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  subscription: Subscription | null = null;

  signupForm: FormGroup;

  termsAccepted: boolean = false;

  attempedSubmit: boolean = false;

  hidden: boolean = true;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly fb: FormBuilder,
    private readonly matDialog: MatDialog,
    private readonly authServise: AuthService,
    private readonly router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', [usernameValidator]],
      email: ['', [emailValidator]],
      password: ['', [passwordValidator]],
    });
  }

  getErrorMessage(name: 'email' | 'password' | 'username'): string | null {
    return this.signupForm.controls?.[name]?.getError(name);
  }

  getTermsErrorMessage(): string | null {
    if (this.attempedSubmit && !this.termsAccepted) {
      return 'Please read and accept terms of service';
    }

    return null;
  }

  submitForm(): void {
    if (!this.attempedSubmit) {
      this.attempedSubmit = true;
    }

    const { signupForm } = this;

    if (signupForm.invalid) {
      signupForm.markAllAsTouched();

      return;
    }

    if (!this.termsAccepted) {
      return;
    }

    const user: ISignupDto = signupForm.getRawValue();

    this.pendingResponceSubject.next(true);
    this.subscription = this.authServise
      .signup(user)
      .pipe(
        tap(() => this.router.navigate(['/signin'])),
        catchError((err) => {
          if (err?.status === 409) {
            this.showUserExistenceError();
          }

          return throwError(() => err);
        }),
        finalize(() => this.pendingResponceSubject.next(false))
      )
      .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(TermsPopupComponent);

    dialogRef.afterClosed().subscribe((result) => {
      this.termsAccepted = result;
      this.cdr.markForCheck();
    });
  }

  togglePasswordVisibility(): void {
    this.hidden = !this.hidden;
  }

  showUserExistenceError(): void {
    const { email } = this.signupForm.controls;
    email.setErrors({ email: `User ${email.getRawValue()} already exists` });
    email.markAsTouched();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
