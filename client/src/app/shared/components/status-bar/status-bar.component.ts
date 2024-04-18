import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RequestStateService } from '@app/shared/services/request-state.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss'],
  imports: [NgIf, AsyncPipe, MatProgressBarModule],
})
export class StatusBarComponent {
  isPendingResponce$: Observable<boolean>;

  constructor(private requestStateService: RequestStateService) {
    this.isPendingResponce$ = this.requestStateService.getLoadingState();
  }
}
