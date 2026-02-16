import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL

//create axios instance
const api = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },  
});

// request interceptors
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

//Auth api call
export const authApi = {
    login: (data) => api.post("/auth/login", data),
    register: (data) => api.post("/auth/register", data),
    verifyEmail: (token) => api.get(`/auth/verify?token=${token}`),
    resendVerification: (email) => api.post("/auth/resend-verification", { email }),
}

//Account api call
export const accountApi = {
    getAll: () => api.get("/accounts"),
    getById: (id) => api.get(`/accounts/${id}`),
    create: (data) => api.post("/accounts", data),
    update: (id, data) => api.put(`/accounts/${id}`, data),
    delete: (id) => api.delete(`/accounts/${id}`),
    getBalance: (id) => api.get(`/accounts/${id}/balance`),
}

// Category api call
export const categoryApi = {
    getAll: () => api.get("/categories"),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post("/categories", data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
    getByType: (type) => api.get(`/categories?type=${type}`),
}

// Transaction api call
export const transactionApi = {
    getAll: () => api.get("/transactions"),
    getById: (id) => api.get(`/transactions/${id}`),
    create: (data) => api.post("/transactions", data),
    update: (id, data) => api.put(`/transactions/${id}`, data),
    delete: (id) => api.delete(`/transactions/${id}`),
}

// Transaction api call
export const transactionTypeApi = {
    getAll: () => api.get("/transactions"),
    getById: (id) => api.get(`/transactions/${id}`),
    create: (data) => api.post("/transactions", data),
    update: (id, data) => api.put(`/transaction/${id}`, data),
    delete: (id) => api.delete(`/transaction/${id}`),
    getSummary: () => api.get("/transactions/summary"),
    getByCategory: () => api.get(`/transactions/by-category`),
}

export const budgetAPI = {
  getAll: () => api.get('/budgets'),
  getCurrent: () => api.get('/budgets/current'),
  getByMonth: (month, year) => api.get(`/budgets?month=${month}&year=${year}`),
  getById: (id) => api.get(`/budgets/${id}`),
  create: (data) => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
};

// Analytics API calls (ADD THIS)
export const analyticsAPI = {
  getMonthlyTrends: (months = 6) => api.get(`/analytics/monthly-trends?months=${months}`),
  getCategoryTrends: (months = 6) => api.get(`/analytics/category-trends?months=${months}`),
  getTopSpendingMonths: (limit = 5) => api.get(`/analytics/top-spending-months?limit=${limit}`),
};

export default api;
    

    
    