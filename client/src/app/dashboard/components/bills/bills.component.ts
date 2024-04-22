import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillsComponent {

}
