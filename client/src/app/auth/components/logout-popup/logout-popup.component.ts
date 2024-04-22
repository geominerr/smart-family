import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, tap } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrls: ['./logout-popup.component.scss'],
  imports: [AsyncPipe, MatDialogModule, MatButtonModule],
})
export class LogoutPopupComponent implements OnDestroy {
  subscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<LogoutPopupComponent>
  ) {}

  logout() {
    this.subscription = this.authService
      .logout()
      .pipe(
        tap(() => {
          this.dialogRef.close();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
