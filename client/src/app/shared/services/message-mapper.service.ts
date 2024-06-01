import { Injectable } from '@angular/core';
import { TActions } from '@app/shared/models/actions.model';

interface Message {
  success: string;
  error: Record<number | string, string>;
}
type TMessageMap = Record<TActions, Message>;

@Injectable({
  providedIn: 'root',
})
export class MessageMapperService {
  private messageMap: TMessageMap = {
    createBudget: {
      success: 'Budget created successfully',
      error: {},
    },
    updateBudget: {
      success: 'Budget updated successfully',
      error: {},
    },
    deleteBudget: {
      success: 'Budget successfully deleted',
      error: {},
    },
    createExpenses: {
      success: 'Expense successfully added',
      error: {},
    },
    createIncome: {
      success: 'Income successfully added',
      error: {},
    },
    updateUserPassword: {
      success: 'Password changed successfully',
      error: {
        403: 'Incorrect old password',
      },
    },
  };

  private defaultErrorMessage: string =
    'Failed attempt, please try again later';

  getSuccessMessage(action: TActions): string {
    return this.messageMap[action].success;
  }

  // eslint-disable-next-line
  getErrorMessage(action: TActions, error: any): string {
    if (error?.statusCode) {
      return (
        this.messageMap[action].error?.[error.statusCode] ||
        this.defaultErrorMessage
      );
    }

    return this.defaultErrorMessage;
  }
}
