import { BaseDir } from '../App';

export const authService = {
  login,
  logout,
  getToken,
  isAuthenticated
};

function login(tokenData) {
  localStorage.setItem('wayne-user-data', JSON.stringify(tokenData));
}

function logout(redirect = true) {
  localStorage.removeItem('wayne-user-data');
  if (redirect) {
    window.location.href = `${BaseDir}/pages/login`;
  }
}

function getToken() {
  const userData = JSON.parse(localStorage.getItem('wayne-user-data') || '{}');
  return userData.authToken || null;
}

function isAuthenticated() {
  return !!getToken();
}
