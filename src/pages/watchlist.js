// Watchlist Page Module
import { state } from '../utils/state.js';
import { renderGrid } from './shared.js';
import { t } from '../utils/translations.js';

export function renderWatchlistPage(renderPageCallback) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    // Watchlist Header
    const watchlistHeader = document.createElement('div');
    watchlistHeader.className = 'section-header';
    watchlistHeader.style.marginBottom = '16px';

    watchlistHeader.innerHTML = `
        <h2 class="section-title">${t('watchlist')}</h2>
        <div style="display: flex; align-items: center; gap: 12px;">
            <label style="color: var(--text-secondary); font-size: 0.9rem;">${t('sortBy')}:</label>
            <select id="watchlist-sort-select" class="sort-select">
                <option value="rating">${t('ratingHighLow')}</option>
                <option value="rating_asc">${t('ratingLowHigh')}</option>
                <option value="name">${t('name')}</option>
                <option value="year">${t('latest')}</option>
            </select>
        </div>
    `;
    mainContent.appendChild(watchlistHeader);

    const watchlistContainer = document.createElement('div');
    watchlistContainer.id = 'watchlist-grid-container';

    if (state.watchlist.length === 0) {
        watchlistContainer.innerHTML = `<p style="color: var(--text-muted); font-style: italic;">Your watchlist is empty. Start adding movies and series!</p>`;
    } else {
        // Initial sort by rating
        const sortedWatchlist = [...state.watchlist].sort((a, b) => b.rating - a.rating);
        watchlistContainer.appendChild(renderGrid(sortedWatchlist, false, renderPageCallback));
    }
    mainContent.appendChild(watchlistContainer);

    // Sort Handler
    const sortSelect = document.getElementById('watchlist-sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            let sortedData = [...state.watchlist];

            if (sortBy === 'name') {
                sortedData.sort((a, b) => a.title.localeCompare(b.title));
            } else if (sortBy === 'rating') {
                sortedData.sort((a, b) => b.rating - a.rating);
            } else if (sortBy === 'rating_asc') {
                sortedData.sort((a, b) => a.rating - b.rating);
            } else if (sortBy === 'year') {
                sortedData.sort((a, b) => b.year - a.year);
            }

            watchlistContainer.innerHTML = '';
            watchlistContainer.appendChild(renderGrid(sortedData, false, renderPageCallback));
        });
    }
}
