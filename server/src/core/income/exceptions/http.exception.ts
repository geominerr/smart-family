import { HttpException, HttpStatus } from '@nestjs/common';

export class IncomeNotFoundException extends HttpException {
  constructor() {
    super(`Income not found`, HttpStatus.NOT_FOUND);
  }
}

export class IncomeCreationException extends HttpException {
  constructor() {
    super('Income not created', HttpStatus.INTERNAL_SERVER_ERROR);
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
