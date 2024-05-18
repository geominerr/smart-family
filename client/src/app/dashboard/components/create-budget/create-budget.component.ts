import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { Subscription, map, tap } from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Store } from '@ngrx/store';
import { UserState } from '@app/store/user/user.reducer';
import { BudgetActions } from '@app/store/budget/budget.actions';

import { BudgetDemoCreateDto } from '@app/shared/models/budget.model';
import { CreateBudgetModalComponent } from '@app/dashboard/components/create-budget-modal/create-budget-modal.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-budget',
  templateUrl: './create-budget.component.html',
  styleUrls: ['./create-budget.component.scss'],
  imports: [NgIf, MatButtonModule],
})
export class CreateBudgetComponent implements OnInit, OnDestroy {
  @Input() user: UserState | undefined;

  private subscription: Subscription | undefined;

  private dialogRef: MatDialogRef<CreateBudgetModalComponent> | undefined;

  private breakpoint: string = '(max-width: 960px)';

  private transformDialog: boolean = false;

  private panelClass: string = 'dialog-transform';

  private demoDudgetDto: BudgetDemoCreateDto = {
    userId: 'none',
    currency: 'USD',
    goal: 10000,
    expensesRecords: 1000,
    incomeRecords: 450,
    period: 3,
  };

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.demoDudgetDto = { ...this.demoDudgetDto, userId: this.user?.id || 'none' };

    this.subscription = this.breakpointObserver
      .observe(this.breakpoint)
      .pipe(
        map((state) => state.matches),
        tap((isTablet) => {
          if (isTablet) {
            this.transformDialog = false;
            this.dialogRef?.removePanelClass(this.panelClass);
          } else {
            this.transformDialog = true;
            this.dialogRef?.addPanelClass(this.panelClass);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  createBudget() {
    this.dialogRef = this.matDialog.open(CreateBudgetModalComponent, {
      data: { userId: this.user?.id },
      panelClass: this.transformDialog ? this.panelClass : '',
    });
  }

  createDemoBudget() {
    this.store.dispatch(
      BudgetActions.createDemoBudget({ dto: { ...this.demoDudgetDto } })
    );
  }
}
