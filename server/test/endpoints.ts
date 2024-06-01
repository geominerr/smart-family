export const authRoutes = {
  signup: '/auth/signup',
  login: '/auth/signin',
  logout: '/auth/logout',
  reset: '/auth/reset',
  refresh: '/auth/refresh',
};

export const budgetRoutes = {
  createDemo: '/budget/demo',
  create: '/budget',
  get: (id: string) => `/budget/${id}`,
  update: (id: string) => `/budget/${id}`,
  delete: (id: string) => `/budget/${id}`,
};

export const userRoutes = {
  create: '/user',
  get: (id: string) => `/user/${id}`,
  update: (id: string) => `/user/${id}`,
  delete: (id: string) => `/user/${id}`,
};

export const expenseRoutes = {
  create: '/expense',
  get: (id: string) => `/expense/${id}`,
  update: (id: string) => `/expense/${id}`,
  delete: (id: string) => `/expense/${id}`,
};

export const incomeRoutes = {
  create: '/income',
  get: (id: string) => `/income/${id}`,
  update: (id: string) => `/income/${id}`,
  delete: (id: string) => `/income/${id}`,
};
