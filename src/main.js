// Main Entry Point - Router
import { state, setCurrentPage, setTheme } from './utils/state.js';
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
      renderProfilePage(renderPage);
      break;
    default:
      renderMoviesPage(renderPage);
  }
}

// Initialize application
function init() {
  // Initialize theme
  setTheme(state.theme);

  // Initialize blue light filter
  if (state.blueLight) {
    document.body.classList.add('blue-light-filter');
  }

  // Initialize navbar with renderPage callback
  initializeNavbar(renderPage);

  // Initialize keyboard shortcuts
  import('./utils/shortcuts.js').then(({ initializeDefaultShortcuts }) => {
    initializeDefaultShortcuts(renderPage);
  });

  // Search functionality
  const searchInput = document.getElementById('global-search');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query.length === 0) {
      // If search is empty, re-render current page
      renderPage(state.currentPage);
      return;
    }

    // Search in current data
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `<h2 class="section-title">Search Results for "${e.target.value}"</h2>`;
    mainContent.appendChild(header);

    // Import data
    import('./data/movies.js').then(({ movies, series }) => {
      const allItems = [...movies, ...series];
      const results = allItems.filter(item =>
        item.title.toLowerCase().includes(query)
      );

      if (results.length === 0) {
        mainContent.innerHTML += `<p style="color: var(--text-muted);">No results found.</p>`;
      } else {
        import('./pages/shared.js').then(({ renderGrid }) => {
          mainContent.appendChild(renderGrid(results, false, renderPage));
        });
      }
    });
  });

  // Keyboard shortcut for search
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
