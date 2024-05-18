import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgFor, TitleCasePipe } from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Store } from '@ngrx/store';
import { ExpensesActions } from '@app/store/expenses/expenses.actions';

import { CategoryIconMapperService } from '@app/shared/services/category-icon-mapper.service';
import {
  TExpenseCategory,
  ExpenseCreateDto,
} from '@app/shared/models/expense.model';
import { IUserData } from '@app/dashboard/models/user-data.model';
import { converteCoinToCents } from '@app/shared/utils/converte-amount.util';

type TControlName = 'amount' | 'description' | 'category';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-expense-modal',
  templateUrl: './expense-modal.component.html',
  styleUrls: ['./expense-modal.component.scss'],
  imports: [
    NgFor,
    TitleCasePipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ExpenseModalComponent implements OnInit {
  categories: TExpenseCategory[] = [
    'CLOTHING',
    'DEBT',
    'EDUCATION',
    'ENTERTAINMENT',
    'FOOD',
    'GIFTS',
    'HEALTHCARE',
    'HOUSEHOLD_ITEMS',
    'HOUSING',
    'INSURANCE',
    'PERSONAL',
    'RETIREMENT',
    'SAVINGS',
    'TRANSPORTATION',
    'UTILITIES',
  ];

  submitted: boolean = false;

  form!: FormGroup;

  minAmountValue: number = 0.01;

  maxAmountValue: number = 2147483646 / 100;

  private alphabetRegexp: RegExp = /^[a-zA-Z\s]*$/;

  private messageMap: Record<TControlName, Record<string, string>> = {
    amount: {
      required: 'Amount is required field',
      min: 'Must be greater 0',
      max: `Must be less ${this.maxAmountValue}`,
    },
    category: { required: 'Category is required field' },
    description: { pattern: 'Description must be a string' },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: IUserData,
    private dialogRef: MatDialogRef<ExpenseModalComponent>,
    private store: Store,
    private fb: FormBuilder,
    private iconMapper: CategoryIconMapperService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      amount: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.pattern(this.alphabetRegexp)]],
    });
  }

  getErrorMessage(controlName: TControlName): string | null {
    const erros = this.form.controls?.[controlName]?.errors;

    if (erros) {
      const errorName = Object.keys(erros)[0];

      return this.messageMap[controlName]?.[errorName];
    }

    return null;
  }

  getIconName(category: TExpenseCategory): string {
    return this.iconMapper.getIconNameByCategory(category);
  }

  submit() {
    if (!this.submitted) {
      this.submitted = true;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const { amount, description, category } = this.form.getRawValue();

    const dto: ExpenseCreateDto = {
      userId: this.data.userId,
      budgetId: this.data.budgetId,
      amount: converteCoinToCents(amount),
      date: new Date().toISOString(),
      description,
      category,
    };

    this.store.dispatch(ExpensesActions.createExpense({ dto }));
    this.dialogRef.close();
  }
}
