const ADMIN_EMAIL = "otambe655@gmail.com";
const ADMIN_PASSWORD = "Sai@9191";
const AUTH_KEY = "is_admin_logged_in";

export const login = (email: string, password: string) => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAdmin = () => {
  return localStorage.getItem(AUTH_KEY) === "true";
};
