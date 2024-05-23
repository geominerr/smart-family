import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription, filter } from 'rxjs';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Store } from '@ngrx/store';
import { selectStatusState } from '@app/store/status/status.selector';
import { MessageMapperService } from '@app/shared/services/message-mapper.service';
import { TActions } from '@app/shared/models/actions.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  imports: [MatSnackBarModule],
})
export class SnackbarComponent implements OnInit, OnDestroy {
  private subcritption: Subscription | undefined;

  private panelClasses = {
    success: 'snackbar--success',
    error: 'snackbar--error',
  };

  private duration: number = 2000;

  constructor(
    private snackBar: MatSnackBar,
    private store: Store,
    private messageService: MessageMapperService
  ) {}

  ngOnInit(): void {
    this.subcritption = this.store
      .select(selectStatusState)
      .pipe(filter((status) => !!status))
      .subscribe((status) => {
        if (status.error) {
          this.openErrorBar(status.action, status.error);

          return;
        }

        this.openSuccessBar(status.action);
      });
  }

  ngOnDestroy(): void {
    this.subcritption?.unsubscribe();
  }

  private openSuccessBar(action: TActions | undefined): void {
    if (action) {
      const message = this.messageService.getSuccessMessage(action);
      this.snackBar.open(message, 'close', {
        duration: this.duration,
        panelClass: this.panelClasses.success,
      });
    }
  }

  private openErrorBar(action: TActions | undefined, error: unknown): void {
    if (action) {
      const message = this.messageService.getErrorMessage(action, error);
      this.snackBar.open(message, 'close', {
        duration: this.duration,
        panelClass: this.panelClasses.error,
      });
    }
  }
}
