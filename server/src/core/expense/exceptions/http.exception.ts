import { HttpException, HttpStatus } from '@nestjs/common';

export class ExpenseNotFoundException extends HttpException {
  constructor() {
    super(`Expense not found`, HttpStatus.NOT_FOUND);
  }
}

export class ExpenseCreationException extends HttpException {
  constructor() {
    super('Expense not created', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class InsufficientPermissionsException extends HttpException {
  constructor() {
    super(
      `Insufficient permissions to perform the operation`,
      HttpStatus.FORBIDDEN,
    );
  }
}
