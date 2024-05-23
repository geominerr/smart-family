import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from '@app/shared/components/snackbar/snackbar.component';
import { StatusBarComponent } from '@app/shared/components/status-bar/status-bar.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, StatusBarComponent, SnackbarComponent],
})
export class AppComponent {
  title = 'client';
}
