export interface User {
  id: string;
  email: string;
  username: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  budgetId: string;
}

export interface UserUpdateDto {
  oldPassword: string;
  newPassword: string;
}
