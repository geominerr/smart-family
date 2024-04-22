export interface IResetDto {
  email: string;
}

export interface ILoginDto extends IResetDto {
  password: string;
}

export interface ISignupDto extends ILoginDto {
  username: string;
}
