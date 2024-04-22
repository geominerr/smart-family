export const descriptionHeaderCookies = {
  'Set-Cookie-1': {
    description:
      'Contains the authentication access token with a maximum age of <expire_time> seconds.',
    schema: {
      type: 'string',
      example:
        'auth=<acces-token>; Max-Age=900; Path=/; Expires=Wed, 17 Apr 2024 18:20:04 GMT; HttpOnly; SameSite=Strict',
    },
  },
  'Set-Cookie-2': {
    description:
      'Contains the refresh token with a maximum age of <refresh_expire_time> seconds.',
    schema: {
      type: 'string',
      example:
        'refresh=<refresh_token_value>; Max-Age=3600; Path=/; Expires=Wed, 17 Apr 2024 19:19:04 GMT; HttpOnly; SameSite=Strict',
    },
  },
  'Set-Cookie-3': {
    description:
      'Contains the authentication status with a maximum age of <refresh_expire_time> seconds',
    schema: {
      type: 'string',
      example:
        '_auth-status=true; Max-Age=3600; Path=/; Expires=Wed, 17 Apr 2024 19:19:04 GMT; SameSite=Strict',
    },
  },
};
