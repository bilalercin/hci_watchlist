// Main Entry Point - Router
import { state, setCurrentPage } from './utils/state.js';
import { initializeNavbar, updateNavActiveState } from './components/navbar.js';
import { renderMoviesPage } from './pages/movies.js';
import { renderSeriesPage } from './pages/series.js';
import { renderListsPage } from './pages/lists.js';
import { renderMyMoviesPage } from './pages/myMovies.js';
import { renderProfilePage } from './pages/profile.js';
import { shortcutManager, initializeDefaultShortcuts } from './utils/shortcuts.js';
import { showInfoFeedback, showErrorFeedback } from './utils/feedback.js';

// Track currently open modal for ESC key handling
let currentModalCloseHandler = null;

export function setModalCloseHandler(handler) {
  currentModalCloseHandler = handler;
}

export function clearModalCloseHandler() {
  currentModalCloseHandler = null;
}

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
  // Initialize navbar with renderPage callback
  initializeNavbar(renderPage);

  // Initialize keyboard shortcuts - Rule #2
  initializeDefaultShortcuts(renderPage, () => {
    if (currentModalCloseHandler) {
      currentModalCloseHandler();
    }
  });

  // Search functionality with better feedback - Rule #3
  const searchInput = document.getElementById('global-search');
  let searchTimeout = null;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    // Debounce search for better performance
    clearTimeout(searchTimeout);

    if (query.length === 0) {
      // If search is empty, re-render current page
      renderPage(state.currentPage);
      return;
    }

    // Show loading feedback for longer searches
    if (query.length > 2) {
      searchTimeout = setTimeout(() => performSearch(query, e.target.value), 300);
    } else {
      performSearch(query, e.target.value);
    }
  });

  function performSearch(query, originalValue) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
      <h2 class="section-title">Search Results for "${originalValue}"</h2>
      <button class="btn-secondary" onclick="document.getElementById('global-search').value = ''; document.getElementById('global-search').dispatchEvent(new Event('input'));">
        Clear Search
      </button>
    `;
    mainContent.appendChild(header);

    // Import data
    import('./data/movies.js').then(({ movies, series }) => {
      const allItems = [...movies, ...series];
      const results = allItems.filter(item =>
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.genre && item.genre.toLowerCase().includes(query))
      );

      if (results.length === 0) {
        // Rule #5: Simple Error Handling with helpful message
        mainContent.innerHTML += `
          <div style="text-align: center; padding: 48px 24px;">
            <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 16px;">
              No results found for "${originalValue}"
            </p>
            <p class="help-text">
              Try different keywords or <a href="#" onclick="document.getElementById('global-search').value = ''; document.getElementById('global-search').dispatchEvent(new Event('input')); return false;" style="color: var(--accent-color);">browse all content</a>
            </p>
          </div>
        `;
      } else {
        // Rule #3: Informative Feedback
        const resultCount = document.createElement('p');
        resultCount.style.color = 'var(--text-secondary)';
        resultCount.style.marginBottom = '16px';
        resultCount.textContent = `Found ${results.length} result${results.length !== 1 ? 's' : ''}`;
        mainContent.appendChild(resultCount);

        import('./pages/shared.js').then(({ renderGrid }) => {
          mainContent.appendChild(renderGrid(results, false, renderPage));
        });
      }
    });
  }

  // Add search shortcut hint - Rule #2
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer && !document.querySelector('.shortcut-hint')) {
    const hint = document.createElement('span');
    hint.className = 'shortcut-hint';
    hint.textContent = '/';
    hint.setAttribute('data-tooltip', 'Press / to search');
    searchContainer.appendChild(hint);
  }

  // Add help button for keyboard shortcuts - Rule #2
  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    const helpBtn = document.createElement('button');
    helpBtn.className = 'btn-secondary';
    helpBtn.innerHTML = '?';
    helpBtn.style.width = '40px';
    helpBtn.style.height = '40px';
    helpBtn.style.padding = '0';
    helpBtn.style.borderRadius = '50%';
    helpBtn.setAttribute('data-tooltip', 'Keyboard shortcuts (?)');
    helpBtn.addEventListener('click', () => {
      shortcutManager.toggleHelp();
    });
    navActions.insertBefore(helpBtn, navActions.firstChild);
  }

  // Initial render
  renderPage('movies');

  // Rule #3: Show welcome message
  setTimeout(() => {
    showInfoFeedback('Press ? to see keyboard shortcuts');
  }, 1000);
}

// Start the app when DOM is ready
init();
