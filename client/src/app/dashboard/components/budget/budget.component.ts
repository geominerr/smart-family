import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgIf, AsyncPipe, NgClass } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, filter, tap } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Store } from '@ngrx/store';
import { selectBudgetState } from '@app/store/budget/budget.selectors';
import { BudgetState } from '@app/store/budget/budget.reducer';
import { BudgetActions } from '@app/store/budget/budget.actions';

type TFieldValue = string | number | undefined;

type TControl = 'name' | 'goal';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  imports: [
    NgIf,
    NgClass,
    AsyncPipe,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
})
export class BudgetComponent implements OnInit {
  budget$: Observable<BudgetState> | undefined;

  form!: FormGroup;

  submitted: boolean = false;

  editMode: boolean = false;

  editableControls: TControl[] = ['name', 'goal'];

  fieldValues: Record<string, TFieldValue> = {
    name: '',
    goal: '',
    currency: '',
  };

  minGoalValue: number = 0.01;

  maxGoalValue: number = 2147483646 / 100;

  private alphabetRegexp: RegExp = /^[a-zA-Z\s]*$/;

  private messageMap: Record<TControl, Record<string, string>> = {
    goal: {
      required: 'Goal is required field',
      min: 'Must be greater 0',
      max: `Must be less ${this.maxGoalValue}`,
    },
    name: {
      required: 'Name is required field',
      pattern: 'Name must be a string',
    },
  };

  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(this.alphabetRegexp)],
      ],
      goal: ['', [Validators.required]],
      currency: ['', []],
    });
    this.form.disable();

    this.budget$ = this.store.select(selectBudgetState).pipe(
      filter((budget) => !!budget.id),
      tap((budget) => {
        this.updateFields(budget);
      })
    );
  }

  getErrorMessage(control: TControl): string | null {
    const errors = this.form.controls?.[control]?.errors;

    if (errors) {
      const errorName = Object.keys(errors)[0];

      return this.messageMap?.[control]?.[errorName];
    }

    return null;
  }

  enableEditMode(): void {
    this.editMode = true;

    this.enableEditableControls();
  }

  disableEditMode(): void {
    this.editMode = false;

    this.restoreFormFieldValues();
    this.form.disable();
  }

  submit(budgetId: string): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submitted = true;

      return;
    }

    const { goal, name } = this.form.getRawValue();

    this.store.dispatch(
      BudgetActions.updateBudget({ id: budgetId, dto: { goal, name } })
    );
    this.disableEditMode();
  }

  private updateFields(budget: BudgetState): void {
    const { name, goal, currency } = budget;

    this.fieldValues = { name, goal, currency };
    this.form.setValue({ name, goal, currency });
  }

  private enableEditableControls(): void {
    this.editableControls.forEach((control) => {
      this.form.controls?.[control].enable();
    });
  }

  private restoreFormFieldValues(): void {
    this.form.setValue({ ...this.fieldValues });
  }
}
