import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, filter } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Store } from '@ngrx/store';
import { UserActions } from '@app/store/user/user.actions';
import { selectUserId } from '@app/store/user/user.selectors';
import { selectUpdateUserStatus } from '@app/store/status/status.selector';

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
export class ChangePasswordComponent implements OnInit, OnDestroy {
  userId$: Observable<string | undefined> | undefined;

  sumbitted: boolean = false;

  form!: FormGroup;

  visibilityState: Record<TControlName, boolean> = {
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  };

  private subcription: Subscription | undefined;

  private validationError = { password: 'Incorrect old password' };

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId$ = this.store.select(selectUserId);

    this.form = this.fb.group({
      oldPassword: ['', [passwordValidator]],
      newPassword: ['', [passwordValidator]],
      confirmPassword: ['', [passwordValidator]],
    });

    this.form.addValidators(
      getPaswordCompareValidator(
        this.form.controls['newPassword'],
        this.form.controls['confirmPassword']
      )
    );

    this.subcription = this.store
      .select(selectUpdateUserStatus)
      .pipe(filter((status) => !!status))
      .subscribe((status) => {
        if (status?.error) {
          const error = status.error as { statusCode: number };

          if (error?.statusCode === 403) {
            this.showIncorrectPasswordError();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.subcription?.unsubscribe();
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
    if (!this.sumbitted) {
      this.sumbitted = true;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();

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

  private showIncorrectPasswordError() {
    const { oldPassword } = this.form.controls;
    oldPassword.setErrors(this.validationError);
    oldPassword.markAsTouched();

    this.ref.markForCheck();
  }
}
