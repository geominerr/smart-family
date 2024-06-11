import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Subscription, filter } from 'rxjs';

import { Store } from '@ngrx/store';
import { selectStatusState } from '@app/store/status/status.selector';

import { MessageMapperService } from '@app/shared/services/message-mapper.service';
import { TActions } from '@app/shared/models/actions.model';

type BarType = 'success' | 'error';

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

  private duration: number = 2000;

  private panelClasses: Record<BarType, string> = {
    success: 'snackbar--success',
    error: 'snackbar--error',
  };

  private transformClass = 'snackbar--transform';

  private breakpoints = {
    tablet: '(max-width: 960px)',
  };

  constructor(
    private snackBar: MatSnackBar,
    private store: Store,
    private messageService: MessageMapperService,
    private breakpointObserver: BreakpointObserver
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
        panelClass: this.getCssStyles('success'),
      });
    }
  }

  private openErrorBar(action: TActions | undefined, error: unknown): void {
    if (action) {
      const message = this.messageService.getErrorMessage(action, error);

      this.snackBar.open(message, 'close', {
        duration: this.duration,
        panelClass: this.getCssStyles('error'),
      });
    }
  }

  private getCssStyles(type: BarType): string[] {
    const styles = [this.panelClasses[type]];
    const transformClass = this.getTransformCssClass();

    if (transformClass) {
      styles.push(transformClass);
    }

    return styles;
  }

  private getTransformCssClass(): string | null {
    return this.breakpointObserver.isMatched(this.breakpoints.tablet)
      ? null
      : this.transformClass;
  }
}
