import { AUTH } from './constants.js';
import { showPage } from './modal.js';
import { initEventListeners } from './login.js';
import { renderFeed } from './feed.js';
import { renderOwnProfile, renderOtherProfile, removeOldProfileElements} from './profile.js';

// === Handle what to show based on hash ===
const handleHashChange = () => {
  removeOldProfileElements();
  const hash = location.hash;
  const userId = localStorage.getItem(AUTH.USER_KEY);
  const token = localStorage.getItem(AUTH.TOKEN_KEY);

  // If not logged in or no hash, show login form
  if (!hash || !userId || !token) {
    showPage('login-form');
    localStorage.clear();
    history.pushState("", document.title, location.pathname + location.search);
    return;
  // If hash is #feed, show homepage and render feed
  } else if (hash === "#feed") {
    showPage('homepage');
    renderFeed();
  // If hash matches logged-in user's profile, render own profile, which satisfies for 2.7.2
  } else if (hash === "#profile" || hash === `#profile=${userId}`) {
    showPage('homepage');
    renderOwnProfile(userId);
  // If hash points to another user's profile, render their profile
  } else if (hash.startsWith("#profile=")) {
    const otherId = hash.split("=")[1];
    showPage('homepage');
    renderOtherProfile(otherId);
  }
};

// Set up listeners and handle initial view 
const init = () => {
  initEventListeners();
  handleHashChange(); 
  window.addEventListener("hashchange", handleHashChange);
};
init();