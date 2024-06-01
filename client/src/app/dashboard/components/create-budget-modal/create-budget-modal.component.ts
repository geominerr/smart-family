import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Store } from '@ngrx/store';
import { BudgetActions } from '@app/store/budget/budget.actions';

import { BudgetCreateDto, CurrencyType } from '@app/shared/models/budget.model';

type TControlName = 'name' | 'currency' | 'goal';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-budget-modal',
  templateUrl: './create-budget-modal.component.html',
  styleUrls: ['./create-budget-modal.component.scss'],
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class CreateBudgetModalComponent implements OnInit {
  currencyType: CurrencyType[] = ['EUR', 'GBP', 'UAH', 'USD'];

  form!: FormGroup;

  submitted: boolean = false;

  minGoalValue: number = 0.01;

  maxGoalValue: number = 2147483646 / 100;

  private alphabetRegexp: RegExp = /^[a-zA-Z\s]*$/;

  private messageMap: Record<TControlName, Record<string, string>> = {
    goal: {
      required: 'Goal is required field',
      min: 'Must be greater 0',
      max: `Must be less ${this.maxGoalValue}`,
    },
    currency: { required: 'Category is required field' },
    name: {
      required: 'Name is required field',
      pattern: 'Name must be a string',
    },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { userId: string },
    private store: Store,
    private fb: FormBuilder,
    private dialorRef: MatDialogRef<CreateBudgetModalComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(this.alphabetRegexp)],
      ],
      currency: ['', [Validators.required]],
      goal: ['', [Validators.required]],
    });
  }

  getErrorMessage(control: TControlName): string | null {
    const erros = this.form.controls?.[control]?.errors;

    if (erros) {
      const errorName = Object.keys(erros)[0];

      return this.messageMap[control]?.[errorName];
    }

    return null;
  }

  submit(): void {
    if (!this.submitted) {
      this.submitted = true;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const { goal, name, currency } = this.form.getRawValue();

    const dto: BudgetCreateDto = {
      userId: this.data.userId,
      name,
      currency,
      goal: Number(goal),
    };

    this.store.dispatch(BudgetActions.createBudget({ dto }));
    this.dialorRef.close();
  }
}
