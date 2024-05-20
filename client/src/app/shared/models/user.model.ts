export interface User {
  id: string;
  email: string;
  username: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  budgetId: string;
}

export interface UserUpdateDto {
  oldPassword: string;
  newPassword: string;
}
