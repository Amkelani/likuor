export const ENDPOINTS = {
  get: {
    tags: 'api/tags',
    users: 'api/users',
    carousel: 'api/slides/',
    banners: 'api/banners/',
    reviews: 'api/reviews',
    discount: 'api/discount',
    products: 'api/products/',
    promocode: 'api/promocode',
    promocodes: 'api/promocodes',
    categories: 'api/categories/'
  },
  post: {
    order: 'api/order/create/',
    orders: 'api/orders/',
  },
  auth: {
    login: 'api/auth/login/',
    signup: 'api/auth/signup/',
    updateUser: 'api/auth/user/update/',
    getUser: 'api/auth/user/details/',
    emailVerify: 'api/auth/email/verify/',
    createNewUser: 'api/auth/user/create',
    ifUserExists: 'api/auth/user/exists',
    ifEmailExists: 'api/auth/email/exists',
    emailConfirm: 'api/auth/email/confirm',
  },
  token: {
    refresh: 'api/token/refresh/'
  }
};
