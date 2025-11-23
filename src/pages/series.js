// Series Page Module
import { state } from '../utils/state.js';
import { series } from '../data/movies.js';
import { renderGrid } from './shared.js';

export function renderSeriesPage(renderPageCallback) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    const title = state.filter.genre === 'All' ? 'All Series' : `${state.filter.genre} Series`;

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `<h2 class="section-title">${title}</h2>`;
    mainContent.appendChild(header);

    let data = series;
    if (state.filter.genre !== 'All') {
        data = data.filter(i => i.genre === state.filter.genre);
    }

    mainContent.appendChild(renderGrid(data, false, renderPageCallback));
}
