import { state, setCurrentPage, setTheme } from './utils/state.js';
import { initializeNavbar, updateNavActiveState } from './components/navbar.js';
import { renderMoviesPage } from './pages/movies.js';
import { renderSeriesPage } from './pages/series.js';
import { renderListsPage } from './pages/lists.js';
import { renderWatchlistPage } from './pages/watchlist.js';
import { renderMyMoviesPage } from './pages/myMovies.js';
import { renderProfilePage } from './pages/profile.js';

function renderPage(pageName) {
  setCurrentPage(pageName);
  updateNavActiveState(pageName);

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
    case 'watchlist':
      renderWatchlistPage(renderPage);
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

function init() {
  setTheme(state.theme);

  if (state.blueLight) {
    document.body.classList.add('blue-light-filter');
  }

  initializeNavbar(renderPage);

  import('./utils/shortcuts.js').then(({ initializeDefaultShortcuts }) => {
    initializeDefaultShortcuts(renderPage);
  });

  const searchInput = document.getElementById('global-search');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query.length === 0) {
      renderPage(state.currentPage);
      return;
    }

    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `<h2 class="section-title">Search Results for "${e.target.value}"</h2>`;
    mainContent.appendChild(header);

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

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  renderPage('movies');
}

init();
