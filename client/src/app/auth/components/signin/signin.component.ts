import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SvgIconsModule } from '../../../shared/material/svg-icons.module';
import { AuthService } from '../../services/authorization/auth.service';
import { emailValidator } from '../../validators/email.validator';
import { passwordValidator } from '../../validators/password.validator';
import { ILoginDto } from '../../models/auth.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  imports: [
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
export class SigninComponent {
  signinForm: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder
  ) {
    this.signinForm = this.fb.group({
      email: ['', [emailValidator]],
      password: ['', [passwordValidator]],
      remember: [false],
    });
  }

  getErrorMessage(name: 'email' | 'password'): string | null {
    const error = this.signinForm.controls?.[name]?.getError(name);

    if (error) {
      return error;
    }

    return null;
  }

  submitForm(): void {
    if (!this.signinForm.invalid) {
      const user: ILoginDto = this.signinForm.getRawValue();
      this.authService.login(user);
    }

    this.signinForm.markAllAsTouched();
  }
}
