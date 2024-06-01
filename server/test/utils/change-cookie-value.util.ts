export const changeCookieValue = (cookies: string[], target: string) => {
  if (!cookies?.length) {
    throw Error('There must be a cookies');
  }

  return cookies.map((cookie) => {
    if (cookie.includes(target)) {
      return cookie
        .split(';')
        .map((value) => {
          if (value.includes(target)) {
            value.split('=').reduce((acc, curr) => {
              acc += `=invalid${curr}`;

              return acc;
            });
          }
        })
        .join(';');
    }

    return cookie;
  });
};
