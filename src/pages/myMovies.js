// My Movies (Rated Items) Page Module
import { state } from '../utils/state.js';
import { renderGrid } from './shared.js';

import { t } from '../utils/translations.js';

function sortData(data, sortBy) {
    const sorted = [...data];
    switch (sortBy) {
        case 'name':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'rating':
            return sorted.sort((a, b) => (b.userRating || 0) - (a.userRating || 0));
        case 'rating_asc':
            return sorted.sort((a, b) => (a.userRating || 0) - (b.userRating || 0));
        case 'year':
            return sorted.sort((a, b) => b.year - a.year);
        default:
            return sorted;
    }
}

export function renderMyMoviesPage(renderPageCallback) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
        <h2 class="section-title">${t('myMovies')}</h2>
        <div style="display: flex; align-items: center; gap: 12px;">
            <label style="color: var(--text-secondary); font-size: 0.9rem;">${t('sortBy')}:</label>
            <select id="sort-select" class="sort-select">
                <option value="rating">${t('ratingHighLow')}</option>
                <option value="rating_asc">${t('ratingLowHigh')}</option>
                <option value="name">${t('name')}</option>
                <option value="year">${t('latest')}</option>
            </select>
        </div>
    `;
    mainContent.appendChild(header);

    if (state.myMovies.length === 0) {
        mainContent.innerHTML += `<p>${t('noRatedMovies')}</p>`;
        return;
    }

    const contentContainer = document.createElement('div');
    contentContainer.id = 'my-movies-content';
    mainContent.appendChild(contentContainer);

    function renderContent(sortBy = 'rating') {
        const myMoviesList = state.myMovies.filter(i => i.type === 'movie' || !i.type);
        const mySeriesList = state.myMovies.filter(i => i.type === 'series');

        const sortedMovies = sortData(myMoviesList, sortBy);
        const sortedSeries = sortData(mySeriesList, sortBy);

        contentContainer.innerHTML = '';

        if (sortedMovies.length > 0) {
            const moviesTitle = document.createElement('h3');
            moviesTitle.style.cssText = 'margin: 24px 0 16px; color: var(--accent-color);';
            moviesTitle.textContent = t('moviesTitle');
            contentContainer.appendChild(moviesTitle);
            contentContainer.appendChild(renderGrid(sortedMovies, true, renderPageCallback));
        }
        if (sortedSeries.length > 0) {
            const seriesTitle = document.createElement('h3');
            seriesTitle.style.cssText = 'margin: 24px 0 16px; color: var(--accent-color);';
            seriesTitle.textContent = t('seriesTitle');
            contentContainer.appendChild(seriesTitle);
            contentContainer.appendChild(renderGrid(sortedSeries, true, renderPageCallback));
        }
    }

    // Initial render
    renderContent('rating');

    // Add sort change listener
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        renderContent(e.target.value);
    });
}
