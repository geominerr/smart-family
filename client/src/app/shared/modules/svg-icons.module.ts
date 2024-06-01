import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  imports: [MatIconModule],
})
export class SvgIconsModule {
  private icons: Record<string, string> = {
    bill: 'assets/icons/bill.svg',
    goal: 'assets/icons/goal.svg',
    group: 'assets/icons/group.svg',
    google: 'assets/icons/google.svg',
    logout: 'assets/icons/logout.svg',
    wallet: 'assets/icons/wallet.svg',
    overview: 'assets/icons/overview.svg',
    settings: 'assets/icons/settings.svg',
    expenses: 'assets/icons/expenses.svg',
    transaction: 'assets/icons/transaction.svg',
    'trend-up': 'assets/icons/trend-up.svg',
    'trend-down': 'assets/icons/trend-down.svg',
    notification: 'assets/icons/notification.svg',
  };

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.registerIcons();
  }

  private registerIcons(): void {
    Object.entries(this.icons).forEach(([name, path]) =>
      this.matIconRegistry.addSvgIcon(
        name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(path)
      )
    );
  }
}
