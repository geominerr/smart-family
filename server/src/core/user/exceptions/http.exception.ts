import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super(`User not found`, HttpStatus.NOT_FOUND);
  }
}

export class IncorrectPasswordException extends HttpException {
  constructor() {
    super(`Incorrect password`, HttpStatus.FORBIDDEN);
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
