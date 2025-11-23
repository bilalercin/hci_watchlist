// Movies Page Module
import { state } from '../utils/state.js';
import { movies } from '../data/movies.js';
import { renderGrid } from './shared.js';

export function renderMoviesPage(renderPageCallback) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    const title = state.filter.genre === 'All' ? 'All Movies' : `${state.filter.genre} Movies`;

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `<h2 class="section-title">${title}</h2>`;
    mainContent.appendChild(header);

    let data = movies;
    if (state.filter.genre !== 'All') {
        data = data.filter(i => i.genre === state.filter.genre);
    }

    mainContent.appendChild(renderGrid(data, false, renderPageCallback));
}
