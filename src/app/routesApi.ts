import { environment as env } from '../environments/environment';
const abu = env.api_base_url;


export const routesApi = {
  admin: {
    base: abu + '/admin',
    test: abu + '/admin/test'
  },
  customer: {
    base: abu + '/customer',
    test: abu + '/customer/test'
  }
};
