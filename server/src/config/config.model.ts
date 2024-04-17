export interface IAppConfig {
  PORT: number;
  CLIENT_URL: string;
}

export interface IJwtConfig {
  CRYPT_SALT: number;
  JWT_SECRET_KEY: string;
  JWT_SECRET_REFRESH_KEY: string;
  TOKEN_EXPIRE_TIME: string;
  TOKEN_REFRESH_EXPIRE_TIME: string;
}

export interface IPostgresConfig {
  DB_HOST_PORT: number;
  DB_CONTAINER_PORT: number;
  DB_HOST: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  DATABASE_URL: string;
}

export interface IGoogleConfig {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URL: string;
  SCOPE: string[];
  REDIRECT_CLIENT_URL: string;
}
