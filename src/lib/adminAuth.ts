const ADMIN_EMAIL = "otambe655@gmail.com";
const ADMIN_PASSWORD = "Sai@9191";
const AUTH_KEY = "admin_logged_in";

export const loginAdmin = (email: string, password: string) => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAdminLoggedIn = () => {
  return localStorage.getItem(AUTH_KEY) === "true";
};
