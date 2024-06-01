export class Tokens {
  accessToken: string;
  expireTime: number;

  refreshToken?: string;
  refreshExpireTime?: number;
}

export class AuthData {
  userId: string;
  tokens: Tokens;
}
