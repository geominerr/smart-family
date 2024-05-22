import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
  TitleCasePipe,
} from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { PorfileComponent } from '@app/dashboard/components/profile/profile.component';
import { ChangePasswordComponent } from '@app/dashboard/components/change-password/change-password.component';
import { BudgetComponent } from '@app/dashboard/components/budget/budget.component';

type TButton = 'profile' | 'security' | 'budget';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [
    NgIf,
    NgFor,
    NgClass,
    AsyncPipe,
    TitleCasePipe,
    MatButtonModule,
    PorfileComponent,
    ChangePasswordComponent,
    BudgetComponent,
  ],
})
export class SettingsComponent {
  tabsState: Record<TButton, boolean> = {
    profile: true,
    security: false,
    budget: false,
  };

  tabs: TButton[] = Object.keys(this.tabsState) as TButton[];

  toggleTab(button: TButton) {
    this.changetabsState(button);
  }

  private changetabsState(button: TButton): void {
    this.tabsState = {
      ...Object.keys(this.tabsState).reduce((acc, key) => {
        if (key === button) {
          acc[key] = true;

          return acc;
        }

        acc[key as TButton] = false;
        return acc;
      }, {} as Record<TButton, boolean>),
    };
  }
}
