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
import { IncomeActions } from '@app/store/income/income.actions';

import { CategoryIconMapperService } from '@app/shared/services/category-icon-mapper.service';
import { IUserData } from '@app/dashboard/models/user-data.model';
import { converteCoinToCents } from '@app/shared/utils/converte-amount.util';
import {
  IncomeCreateDto,
  TIncomeCategory,
} from '@app/shared/models/income.model';

type TControlName = 'amount' | 'description' | 'category';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-income-modal',
  templateUrl: './income-modal.component.html',
  styleUrls: ['./income-modal.component.scss'],
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
export class IncomeModalComponent implements OnInit {
  categories: TIncomeCategory[] = [
    'SALARY',
    'FREELANCE',
    'BUSINESS_INCOME',
    'GIFTS',
    'INVESTMENTS',
    'RENTAL_INCOME',
    'OTHER',
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
    private dialogRef: MatDialogRef<IncomeModalComponent>,
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
    const errors = this.form.controls?.[controlName]?.errors;

    if (errors) {
      const errorName = Object.keys(errors)[0];

      return this.messageMap[controlName]?.[errorName];
    }

    return null;
  }

  getIconName(category: TIncomeCategory): string {
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

    const dto: IncomeCreateDto = {
      userId: this.data.userId,
      budgetId: this.data.budgetId,
      amount: converteCoinToCents(amount),
      date: new Date().toISOString(),
      description,
      category,
    };

    this.store.dispatch(IncomeActions.createIncome({ dto }));
    this.dialogRef.close();
  }
}
