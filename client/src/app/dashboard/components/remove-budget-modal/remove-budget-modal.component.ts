import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { BudgetActions } from '@app/store/budget/budget.actions';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-remove-budget-modal',
  templateUrl: './remove-budget-modal.component.html',
  styleUrls: ['./remove-budget-modal.component.scss'],
  imports: [MatDialogModule, MatButtonModule],
})
export class RemoveBudgetModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { budgetId: string },
    private store: Store,
    private dialogRef: MatDialogRef<RemoveBudgetModalComponent>
  ) {}

  removeBudget() {
    this.store.dispatch(BudgetActions.deleteBudget({ id: this.data.budgetId }));
    this.dialogRef.close();
  }
}
