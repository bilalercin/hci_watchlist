// Main Entry Point - Router
import { state, setCurrentPage } from './utils/state.js';
import { initializeNavbar, updateNavActiveState } from './components/navbar.js';
import { renderMoviesPage } from './pages/movies.js';
import { renderSeriesPage } from './pages/series.js';
import { renderListsPage } from './pages/lists.js';
import { renderMyMoviesPage } from './pages/myMovies.js';
import { renderProfilePage } from './pages/profile.js';

// Main render function (router)
function renderPage(pageName) {
  setCurrentPage(pageName);
  updateNavActiveState(pageName);

  // Route to appropriate page
  switch (pageName) {
    case 'movies':
      renderMoviesPage(renderPage);
      break;
    case 'series':
      renderSeriesPage(renderPage);
      break;
    case 'lists':
      renderListsPage(renderPage);
      break;
    case 'my-movies':
      renderMyMoviesPage(renderPage);
      break;
    case 'profile':
      renderProfilePage();
      break;
    default:
      renderMoviesPage(renderPage);
  }
}

// Initialize application
function init() {
  // Initialize navbar with renderPage callback
  initializeNavbar(renderPage);

  // Keyboard shortcut for search
  const searchInput = document.getElementById('global-search');
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Initial render
  renderPage('movies');
}

// Start the app when DOM is ready
init();
