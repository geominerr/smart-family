import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Store } from '@ngrx/store';
import { UserActions } from '@app/store/user/user.actions';
import { selectUserId } from '@app/store/user/user.selectors';

import { passwordValidator } from '@app/shared/validators/password.validator';
import { getPaswordCompareValidator } from '@app/shared/validators/password-compare.validator';

type TControlName = 'oldPassword' | 'newPassword' | 'confirmPassword';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  imports: [
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
})
export class ChangePasswordComponent implements OnInit {
  userId$: Observable<string | undefined> | undefined;

  sumbitted: boolean = false;

  form!: FormGroup;

  visibilityState: Record<TControlName, boolean> = {
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  };

  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userId$ = this.store.select(selectUserId);

    this.form = this.fb.group({
      oldPassword: ['', passwordValidator],
      newPassword: ['', passwordValidator],
      confirmPassword: ['', passwordValidator],
    });

    this.form.addValidators(
      getPaswordCompareValidator(
        this.form.controls['newPassword'],
        this.form.controls['confirmPassword']
      )
    );
  }

  getErrorMessage(control: TControlName): string {
    return (
      this.form.controls[control].getError('password') ||
      this.form.controls[control].getError('notMatch')
    );
  }

  changeVisibility(control: TControlName): void {
    this.visibilityState[control] = !this.visibilityState[control];
  }

  submit(userId: string): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.sumbitted = true;

      return;
    }

    const { oldPassword, newPassword } = this.form.getRawValue();

    this.store.dispatch(
      UserActions.updateUser({
        id: userId,
        dto: { oldPassword, newPassword },
      })
    );
  }
}
