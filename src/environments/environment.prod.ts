export const environment = {
  production: true,
  api_base_url: 'http://localhost:4445/api',
  auth_urls: {
    afterGoodLogin: '/{loggedUserRole}',
    afterBadLogin: '/login',
    afterLogout: '/login'
  },
  cookieOpts: {
    // domain: 'localhost',
    path: '/',
    expires: 1,
    // expires: new Date('2018-10-31T03:24:00'),
    secure: false,
    httpOnly: false,
    sameSite: 'strict'
  }
};
