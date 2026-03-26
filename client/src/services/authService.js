import api, { authApi } from './api';

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

const authService = {
  register: async (userData) => {
    const payload = {
      firstName: userData.firstName || userData.first_name,
      lastName: userData.lastName || userData.last_name,
      email: userData.email,
      password: userData.password,
    };
    const response = await authApi.post('/signup', payload);
    return response.data;
  },

  login: async (credentials) => {
    const response = await authApi.post('/login', {
      email: credentials.email,
      password: credentials.password,
    });

    const { token, refreshToken, expiresIn } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    const payload = decodeJwtPayload(token);
    let user = { email: credentials.email };

    try {
      const userRes = await api.get(`/users/search?email=${credentials.email}`);
      user = userRes.data;
    } catch {
      if (payload) {
        user = { email: payload.sub || credentials.email, id: payload.userId };
      }
    }

    if (user.id) {
      try {
        const studentRes = await api.get(`/users/${user.id}/student`);
        user.studentId = studentRes.data.studentId;
      } catch {
        // No student record yet
      }
    }

    localStorage.setItem('user', JSON.stringify(user));
    return { token, refreshToken, expiresIn, user };
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      if (refreshToken) {
        await authApi.post('/logout', { refreshToken });
      }
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: async () => {
    try {
      const storedUser = authService.getUser();
      if (storedUser?.email) {
        const response = await api.get(`/users/search?email=${storedUser.email}`);
        const user = response.data;

        if (user.id) {
          try {
            const studentRes = await api.get(`/users/${user.id}/student`);
            user.studentId = studentRes.data.studentId;
          } catch {
            // No student record
          }
        }

        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      return storedUser;
    } catch {
      return authService.getUser();
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAdmin: () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return false;
      const parsed = JSON.parse(user);
      const role = parsed.role || parsed.authorities?.[0]?.authority || '';
      return role === 'ADMIN' || role === 'admin' || role === 'ROLE_ADMIN';
    } catch {
      return false;
    }
  },

  getUserId: () => {
    const user = authService.getUser();
    return user?.id || null;
  },

  getStudentId: () => {
    const user = authService.getUser();
    return user?.studentId || null;
  },
};

export default authService;
