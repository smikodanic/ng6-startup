// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  api_base_url: 'http://localhost:4444/api',
  auth_urls: {
    afterGoodLogin: '/{loggedUserRole}', // {loggedUserRole} -> 'admin' | 'customer'
    afterBadLogin: '/login',
    afterLogout: '/login'
  },
  cookie_options: {
    // domain: 'localhost',
    path: '/',
    expires: 3,
    // expires: new Date('2018-10-31T03:24:00'),
    secure: false,
    httpOnly: false,
    sameSite: 'strict'
  }
};
