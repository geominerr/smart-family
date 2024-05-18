import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BudgetActions } from '@app/store/budget/budget.actions';

import { CreateBudgetComponent } from './create-budget.component';

describe('CreateBudgetComponent', () => {
  let component: CreateBudgetComponent;
  let fixture: ComponentFixture<CreateBudgetComponent>;
  let store: MockStore;
  let loader: HarnessLoader;
  let rootLoader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CreateBudgetComponent,
        MatDialogModule,
      ],
      providers: [MatDialog, provideMockStore()],
    }).compileComponents();
    fixture = TestBed.createComponent(CreateBudgetComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should dispatch createDemoBudget action with correct dto, after clicking the button "Use Demo Budget"', async () => {
    const dispatchSpyon = jest.spyOn(store, 'dispatch');
    const buttonText = 'Use Demo Budget';
    // eslint-disable-next-line @typescript-eslint/dot-notation
    const dto = component['demoDudgetDto'];
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    const targetButton = buttons[0];
    const targetButtonText = await targetButton.getText();

    expect(targetButtonText).toBe(buttonText);

    await targetButton.click();

    expect(dispatchSpyon).toHaveBeenCalledWith(
      BudgetActions.createDemoBudget({ dto })
    );
  });

  it('should open a dialog after clicking the button "Create Budget"', async () => {
    const dialogBefore = await rootLoader.getHarnessOrNull(MatDialogHarness);
    expect(dialogBefore).toBeNull();

    const buttonText = 'Create Budget';
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    const targetButton = buttons[1];
    const targetButtonText = await targetButton.getText();

    expect(targetButtonText).toBe(buttonText);

    await targetButton.click();
    const dialog = await rootLoader.getHarnessOrNull(MatDialogHarness);

    expect(dialog).toBeTruthy();
  });
});
