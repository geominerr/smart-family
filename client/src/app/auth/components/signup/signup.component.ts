import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AuthService } from '../../services/authorization/auth.service';
import { TermsPopupComponent } from '../terms-popup/terms-popup.component';
import { SvgIconsModule } from '../../../shared/material/svg-icons.module';
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
    NgIf,
    ReactiveFormsModule,
    RouterLink,
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
  providers: [MatDialog],
})
export class SignupComponent {
  signupForm: FormGroup;

  termsAccepted: boolean = false;

  submitted: boolean = false;

  hidden: boolean = true;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly fb: FormBuilder,
    private readonly matDialog: MatDialog,
    private readonly authServise: AuthService
  ) {
    this.signupForm = this.fb.group({
      username: ['', [usernameValidator]],
      email: ['', [emailValidator]],
      password: ['', [passwordValidator]],
    });
  }

  getErrorMessage(name: 'email' | 'password' | 'username'): string | null {
    const error = this.signupForm.controls?.[name]?.getError(name);

    if (error) {
      return error;
    }

    return null;
  }

  getTermsErrorMessage(): string | null {
    if (this.submitted && !this.termsAccepted) {
      return 'Please read and accept terms of service';
    }

    return null;
  }

  submitForm(): void {
    if (!this.submitted) {
      this.submitted = true;
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
    this.authServise.signup(user);
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(TermsPopupComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.termsAccepted = result;
        this.cdr.detectChanges();

        return;
      }

      this.termsAccepted = false;
      this.cdr.detectChanges();
    });
  }

  togglePasswordVisibility(): void {
    this.hidden = !this.hidden;
  }
}
