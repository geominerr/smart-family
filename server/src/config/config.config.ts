export const appConfig = () => ({
  APP_CONFIG: {
    PORT: parseInt(process.env.PORT) || 3000,
    CLIENT_URL: process.env.CLIENT_URL,
  },
});

export const jwtConfig = () => ({
  JWT_CONFIG: {
    CRYPT_SALT: parseInt(process.env.CRYPT_SALT),
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_SECRET_REFRESH_KEY: process.env.JWT_SECRET_REFRESH_KEY,
    TOKEN_EXPIRE_TIME: process.env.TOKEN_EXPIRE_TIME,
    TOKEN_REFRESH_EXPIRE_TIME: process.env.TOKEN_REFRESH_EXPIRE_TIME,
  },
});

export const googleConfig = () => ({
  GOOGLE_CONFIG: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URL: process.env.REDIRECT_URL,
    SCOPE: process.env.SCOPE?.split(','),
    REDIRECT_CLIENT_URL: process.env.REDIRECT_CLIENT_URL,
  },
});
