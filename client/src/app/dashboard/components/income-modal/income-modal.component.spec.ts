import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatErrorHarness } from '@angular/material/form-field/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { IncomeModalComponent } from './income-modal.component';

describe('IncomeModalComponent', () => {
  let component: IncomeModalComponent;
  let fixture: ComponentFixture<IncomeModalComponent>;
  let store: MockStore;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [IncomeModalComponent, NoopAnimationsModule],
      providers: [
        provideMockStore(),
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(IncomeModalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should dispatch createBudget action if form valid', async () => {
    const dispatchSpyon = jest.spyOn(store, 'dispatch');
    const userId = 'userID';
    const budgetId = 'budgetID';
    const validFormData = {
      amount: 123,
      category: 'SALARY',
      description: '',
    };

    // eslint-disable-next-line @typescript-eslint/dot-notation
    component['data'].userId = userId;
    // eslint-disable-next-line @typescript-eslint/dot-notation
    component['data'].budgetId = budgetId;
    component.form.setValue({ ...validFormData });
    component.submit();

    expect(dispatchSpyon).toHaveBeenCalled();
  });

  it('should not dispatch createBuget action if form invalid', async () => {
    const dispatchSpyon = jest.spyOn(store, 'dispatch');
    const invalidFormData = {
      amount: 'abc',
      category: '',
      description: '123 @ 123',
    };

    component.form.setValue({ ...invalidFormData });
    component.submit();

    expect(dispatchSpyon).not.toHaveBeenCalled();
  });

  it('should disable the button after click if the form is invalid', async () => {
    const submitButton = await loader.getHarness(MatButtonHarness);
    const isDisabledBeforeClick = await submitButton.isDisabled();

    expect(isDisabledBeforeClick).toBeFalsy();

    const invalidFormData = {
      amount: 'abc',
      category: '',
      description: '123 @ 123',
    };
    component.form.setValue({ ...invalidFormData });

    await submitButton.click();
    const isDisabledAfterClick = await submitButton.isDisabled();

    expect(isDisabledAfterClick).toBeTruthy();
  });

  it('should show error messages if the fields are empty', async () => {
    const amountErrors = 2;
    const matErrorsBefore = await loader.getAllHarnesses(MatErrorHarness);
    expect(matErrorsBefore?.length).toBeFalsy();

    const invalidFormData = {
      amount: '',
      category: '',
      description: '',
    };
    component.form.setValue(invalidFormData);
    component.form.markAllAsTouched();
    const matErrors = await loader.getAllHarnesses(MatErrorHarness);

    expect(matErrors.length).toBe(amountErrors);
  });

  it('should show error message if amount less min value', async () => {
    const amountMatErrorBefore = await loader.getHarnessOrNull(MatErrorHarness);
    expect(amountMatErrorBefore).toBeNull();

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const errorText = component['messageMap'].amount['min'];
    const amountLessMinValue = component.minAmountValue - 0.001;
    const invalidFormData = {
      amount: amountLessMinValue,
      category: 'SALARY',
      description: '',
    };

    component.form.setValue(invalidFormData);
    component.form.markAllAsTouched();

    const amountMatError = await loader.getHarnessOrNull(MatErrorHarness);
    const amountErrorText = await amountMatError?.getText();

    expect(amountMatError).toBeTruthy();
    expect(amountErrorText).toBe(errorText);
  });

  it('should show error message if amount greater max value', async () => {
    const amountMatErrorBefore = await loader.getHarnessOrNull(MatErrorHarness);
    expect(amountMatErrorBefore).toBeNull();

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const errorText = component['messageMap'].amount['max'];
    const amountGreaterMaxValue = component.maxAmountValue + 0.001;
    const invalidFormData = {
      amount: amountGreaterMaxValue,
      category: 'SALARY',
      description: '',
    };
    component.form.setValue(invalidFormData);
    component.form.markAllAsTouched();

    const amountMatError = await loader.getHarnessOrNull(MatErrorHarness);
    const amountErrorText = await amountMatError?.getText();

    expect(amountMatError).toBeTruthy();
    expect(amountErrorText).toBe(errorText);
  });
});
