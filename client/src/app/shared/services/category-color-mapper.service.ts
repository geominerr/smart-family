import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryColorMapperService {
  private colorMap: Record<string, string> = {
    HOUSING: 'rgb(255, 170, 153)',
    TRANSPORTATION: 'rgb(153, 170, 255)',
    FOOD: 'rgb(255, 221, 153)',
    UTILITIES: 'rgb(153, 221, 153)',
    CLOTHING: 'rgb(204, 153, 255)',
    HEALTHCARE: 'rgb(255, 153, 153)',
    INSURANCE: 'rgb(255, 204, 153)',
    HOUSEHOLD_ITEMS: 'rgb(255, 187, 221)',
    PERSONAL: 'rgb(255, 238, 153)',
    DEBT: 'rgb(187, 187, 187)',
    RETIREMENT: 'rgb(153, 204, 255)',
    EDUCATION: 'rgb(153, 255, 153)',
    SAVINGS: 'rgb(153, 238, 255)',
    GIFTS: 'rgb(255, 153, 255)',
    ENTERTAINMENT: 'rgb(187, 153, 255)',
    SALARY: 'rgb(153, 255, 153)',
    FREELANCE: 'rgb(255, 187, 153)',
    INVESTMENTS: 'rgb(255, 153, 153)',
    BUSINESS: 'rgb(255, 255, 153)',
    RENTAL: 'rgb(153, 255, 255)',
    OTHER: 'rgb(204, 204, 204)',
  };

  private defaultColor: string = 'rgb(204, 204, 204)';

  getColorByCategory(category: string): string {
    return this.colorMap[category] || this.defaultColor;
  }
}
