import { AsyncPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver } from '@angular/cdk/layout';

import { Store } from '@ngrx/store';
import { UserState } from '@app/store/user/user.reducer';
import { selectBudgetMode } from '@app/store/budget/budget.selectors';

import { SvgIconsModule } from '@app/shared/modules/svg-icons.module';
import { IUserData } from '@app/dashboard/models/user-data.model';

import { ExpenseModalComponent } from '@app/dashboard/components/expense-modal/expense-modal.component';
import { IncomeModalComponent } from '@app/dashboard/components/income-modal/income-modal.component';
import { RemoveBudgetModalComponent } from '@app/dashboard/components/remove-budget-modal/remove-budget-modal.component';

type TModalComponent =
  | ExpenseModalComponent
  | IncomeModalComponent
  | RemoveBudgetModalComponent;

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    NgIf,
    NgClass,
    AsyncPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    SvgIconsModule,
  ],
})
export class HeaderComponent implements OnInit {
  @Input() user: UserState | undefined | null;

  demoMode$: Observable<boolean | undefined> | undefined;

  currDate: Date = new Date();

  isTablet$: Observable<boolean> | undefined;

  isMobile$: Observable<boolean> | undefined;

  private breakpoints = {
    tablet: '(max-width: 960px)',
    mobile: '(max-width: 600px)',
  };

  private transformDialog: boolean = false;

  private panelClass: string = 'dialog-transform';

  private dialogRef: MatDialogRef<TModalComponent> | undefined;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private matDialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.demoMode$ = this.store.select(selectBudgetMode);

    this.isTablet$ = this.breakpointObserver
      .observe(this.breakpoints.tablet)
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
      );

    this.isMobile$ = this.breakpointObserver
      .observe(this.breakpoints.mobile)
      .pipe(map((state) => state.matches));
  }

  openExpenseDialog(): void {
    const userData = this.getUserData();

    if (userData) {
      this.dialogRef = this.matDialog.open(ExpenseModalComponent, {
        data: { ...userData },
        panelClass: this.transformDialog ? this.panelClass : '',
      });
    }
  }

  openIncomeDialog(): void {
    const userData = this.getUserData();

    if (userData) {
      this.dialogRef = this.matDialog.open(IncomeModalComponent, {
        data: { ...userData },
        panelClass: this.transformDialog ? this.panelClass : '',
      });
    }
  }

  openRemoveBudgetDialog(): void {
    const userData = this.getUserData();

    if (userData) {
      this.dialogRef = this.matDialog.open(RemoveBudgetModalComponent, {
        data: { budgetId: userData.budgetId },
        panelClass: this.transformDialog ? this.panelClass : '',
      });
    }
  }

  private getUserData(): IUserData | null {
    const { user } = this;

    if (user?.id && user?.budgetId) {
      return {
        userId: user.id,
        budgetId: user.budgetId,
      };
    }

    return null;
  }
}
