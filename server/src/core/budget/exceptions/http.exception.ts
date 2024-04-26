import { HttpException, HttpStatus } from '@nestjs/common';

export class BudgetNotFoundException extends HttpException {
  constructor() {
    super(`Budget not found`, HttpStatus.NOT_FOUND);
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
