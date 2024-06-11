import { Injectable } from '@angular/core';

import { TTransactionCategory } from '@app/shared/models/transactions.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryIconMapperService {
  private iconMap: Record<TTransactionCategory, string> = {
    HOUSING: 'home',
    TRANSPORTATION: 'directions_car',
    FOOD: 'restaurant',
    UTILITIES: 'settings',
    CLOTHING: 'accessibility',
    HEALTHCARE: 'local_hospital',
    INSURANCE: 'security',
    HOUSEHOLD_ITEMS: 'house',
    PERSONAL: 'person',
    DEBT: 'money_off',
    RETIREMENT: 'account_balance',
    EDUCATION: 'school',
    SAVINGS: 'savings',
    GIFTS: 'card_giftcard',
    ENTERTAINMENT: 'theaters',
    SALARY: 'attach_money',
    FREELANCE: 'work',
    INVESTMENTS: 'trending_up',
    BUSINESS: 'business',
    RENTAL: 'home_work',
    OTHER: 'alt_route',
  };

  private defaultIcon: string = 'category';

  getIconNameByCategory(category: TTransactionCategory): string {
    return this.iconMap[category] || this.defaultIcon;
  }
}
