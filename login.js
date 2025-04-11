import { registerToBackend } from './data-provider.js';
import { loginToBackend } from './data-provider.js';
import { handleError } from './data-provider.js';
import { AUTH } from './constants.js';
import { createErrorPopup, showPage } from './modal.js';
import { renderFeed } from './feed.js';

const register = document.getElementById("register");
const showRegister = document.getElementById("showRegister");
const login = document.getElementById('login');
const email = document.getElementById('register-email');
const name = document.getElementById('register-name');
const password = document.getElementById('register-password');
const confirmPassword = document.getElementById('register-confirmpassword');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const logoutButton = document.getElementById('logout');

// Initialize all button click event listeners
export const initEventListeners = () => {
  // Show registration form when "Register" link is clicked
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('register-form');
  });

  // Show login form when "Login" link is clicked
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('login-form');
  });

  // Handle user registration
  register.addEventListener('click', (e) => {
    e.preventDefault();
    const emailValue = email.value;
    const nameValue = name.value;
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;

    // Input validation
    if (!emailValue) {
      createErrorPopup("Email cannot be empty");
    } else if (!nameValue) {
      createErrorPopup("Name cannot be empty");
    } else if (passwordValue !== confirmPasswordValue) {
      createErrorPopup("Passwords do not match!");
      return;
    } else {
      // Register to backend
      registerToBackend(emailValue, passwordValue, nameValue)
        .then((data) => {
          if (data.token) {
            localStorage.setItem(AUTH.TOKEN_KEY, data.token);
            localStorage.setItem(AUTH.USER_KEY, data.userId);
            // Navigate to homepage and render feed
            showPage('homepage');
            history.pushState("", document.title, location.pathname + location.search + '#feed');
            renderFeed();
          }
        });
    }
  });

  // Handle user login
  login.addEventListener('click', (e) => {
    e.preventDefault();
    const loginEmailValue = loginEmail.value;
    const loginPasswordValue = loginPassword.value;

    // Input validation
    if (!loginEmailValue) {
      createErrorPopup("Email cannot be empty");
    } else if (!loginPasswordValue) {
      createErrorPopup("Password cannot be empty");
    } else {
      // Send login request to backend
      loginToBackend(loginEmailValue, loginPasswordValue)
        .then(handleError)
        .then((data) => {
          if (data.token) {
            localStorage.setItem(AUTH.TOKEN_KEY, data.token);
            localStorage.setItem(AUTH.USER_KEY, data.userId);
            // Show homepage and feed
            showPage('homepage');
            history.pushState("", document.title, location.pathname + location.search + '#feed');
            renderFeed();
          }
        })
        .catch((error) => {
          createErrorPopup(error.message);
        });
    }
  });

  // Handle logout: clear session and refresh the page
  logoutButton.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
  });
};

