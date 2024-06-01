import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatErrorHarness } from '@angular/material/form-field/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BudgetActions } from '@app/store/budget/budget.actions';

import { CurrencyType } from '@app/shared/models/budget.model';

import { CreateBudgetModalComponent } from './create-budget-modal.component';

describe('CreateBudgetModalComponent', () => {
  let component: CreateBudgetModalComponent;
  let fixture: ComponentFixture<CreateBudgetModalComponent>;
  let store: MockStore;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBudgetModalComponent, NoopAnimationsModule],
      providers: [
        provideMockStore(),
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CreateBudgetModalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should dispatch createBudget action if form valid', async () => {
    const dispatchSpyon = jest.spyOn(store, 'dispatch');
    const userId = 'userID';
    const validFormData = {
      name: 'Budget name',
      currency: 'EUR' as CurrencyType,
      goal: 111,
    };

    // eslint-disable-next-line @typescript-eslint/dot-notation
    component['data'].userId = userId;
    component.form.setValue({ ...validFormData });
    component.submit();

    expect(dispatchSpyon).toHaveBeenCalledWith(
      BudgetActions.createBudget({ dto: { userId, ...validFormData } })
    );
  });

  it('should not dispatch createBuget action if form invalid', async () => {
    const dispatchSpyon = jest.spyOn(store, 'dispatch');
    const invalidFormData = {
      name: 'Budget name 111',
      currency: 'EUR',
      goal: '111',
    };

    component.form.setValue({ ...invalidFormData });
    component.submit();

    expect(dispatchSpyon).not.toHaveBeenCalled();
  });

  it('should disable the button after click if the form is not valid', async () => {
    const submitButton = await loader.getHarness(MatButtonHarness);
    const isDisabledBeforeClick = await submitButton.isDisabled();

    expect(isDisabledBeforeClick).toBeFalsy();

    const invalidFormData = {
      name: 'Budget name 111',
      currency: 'EUR',
      goal: '111',
    };
    component.form.setValue({ ...invalidFormData });

    await submitButton.click();
    const isDisabledAfterClick = await submitButton.isDisabled();

    expect(isDisabledAfterClick).toBeTruthy();
  });

  it('should show error messages if the fields are empty', async () => {
    const amountErrors = 3;
    const matErrorsBefore = await loader.getAllHarnesses(MatErrorHarness);
    expect(matErrorsBefore?.length).toBeFalsy();

    const invalidFormData = {
      name: '',
      currency: '',
      goal: '',
    };
    component.form.setValue(invalidFormData);
    component.form.markAllAsTouched();
    const matErrors = await loader.getAllHarnesses(MatErrorHarness);

    expect(matErrors.length).toBe(amountErrors);
  });

  it('should show error message if goal less min value', async () => {
    const goalMatErrorBefore = await loader.getHarnessOrNull(MatErrorHarness);
    expect(goalMatErrorBefore).toBeNull();

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const errorText = component['messageMap'].goal['min'];
    const goalLessMinValue = component.minGoalValue - 0.001;
    const invalidFormData = {
      name: 'Budget name',
      currency: 'EUR',
      goal: goalLessMinValue,
    };
    component.form.setValue(invalidFormData);
    component.form.markAllAsTouched();

    const goalMatError = await loader.getHarnessOrNull(MatErrorHarness);
    const goalErrorText = await goalMatError?.getText();

    expect(goalMatError).toBeTruthy();
    expect(goalErrorText).toBe(errorText);
  });

  it('should show error message if goal greater max value', async () => {
    const goalMatErrorBefore = await loader.getHarnessOrNull(MatErrorHarness);
    expect(goalMatErrorBefore).toBeNull();

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const errorText = component['messageMap'].goal['max'];
    const goalGreaterMaxValue = component.maxGoalValue + 0.001;
    const invalidFormData = {
      name: 'Budget name',
      currency: 'EUR',
      goal: goalGreaterMaxValue,
    };
    component.form.setValue(invalidFormData);
    component.form.markAllAsTouched();

    const goalMatError = await loader.getHarnessOrNull(MatErrorHarness);
    const goalErrorText = await goalMatError?.getText();

    expect(goalMatError).toBeTruthy();
    expect(goalErrorText).toBe(errorText);
  });
});
