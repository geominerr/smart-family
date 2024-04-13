import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthService } from '../../services/authorization/auth.service';
import { emailValidator } from '../../validators/email.validator';
import { IResetDto } from '../../models/auth.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
})
export class PasswordRecoveryComponent {
  passwordResetForm: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder
  ) {
    this.passwordResetForm = this.fb.group({
      email: ['', [emailValidator]],
    });
  }

  getErrorMessage(name: 'email'): string | null {
    const error = this.passwordResetForm.controls?.[name]?.getError(name);

    if (error) {
      return error;
    }

    return null;
  }

  submitForm(): void {
    if (!this.passwordResetForm.invalid) {
      const email: IResetDto = this.passwordResetForm.getRawValue();

      this.authService.resetPassword(email);
    }

    this.passwordResetForm.markAllAsTouched();
  }
}
