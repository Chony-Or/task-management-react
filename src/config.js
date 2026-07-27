const DEFAULT_API_BASE_URL = import.meta.env.PROD ? "/api/proxy" : "/api";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
export const API_URL = API_BASE_URL.includes("/api") ? API_BASE_URL : `${API_BASE_URL}/api`;
