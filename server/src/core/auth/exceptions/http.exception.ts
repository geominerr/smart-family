import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(`User already exists.`, HttpStatus.CONFLICT);
  }
}

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

export class RefreshTokenNotFoundException extends HttpException {
  constructor() {
    super(`Refresh Token not found`, HttpStatus.BAD_REQUEST);
  }
}
