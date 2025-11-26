// Series Page Module
import { state } from '../utils/state.js';
import { series } from '../data/movies.js';
import { renderGrid } from './shared.js';

import { t } from '../utils/translations.js';

function sortData(data, sortBy) {
    const sorted = [...data];
    switch (sortBy) {
        case 'name':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'rating_asc':
            return sorted.sort((a, b) => a.rating - b.rating);
        case 'year':
            return sorted.sort((a, b) => b.year - a.year);
        default:
            return sorted;
    }
}

export function renderSeriesPage(renderPageCallback) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    const title = state.filter.genre === 'All' ? t('seriesTitle') : `${state.filter.genre} ${t('seriesTitle')}`;

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
        <h2 class="section-title">${title}</h2>
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

    let data = series;
    if (state.filter.genre !== 'All') {
        data = data.filter(i => i.genre === state.filter.genre);
    }

    // Initial sort by rating
    data = sortData(data, 'rating');

    const gridContainer = document.createElement('div');
    gridContainer.id = 'series-grid-container';
    gridContainer.appendChild(renderGrid(data, false, renderPageCallback));
    mainContent.appendChild(gridContainer);

    // Add sort change listener
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        let filteredData = series;
        if (state.filter.genre !== 'All') {
            filteredData = filteredData.filter(i => i.genre === state.filter.genre);
        }
        const sortedData = sortData(filteredData, e.target.value);

        const container = document.getElementById('series-grid-container');
        container.innerHTML = '';
        container.appendChild(renderGrid(sortedData, false, renderPageCallback));
    });
}
