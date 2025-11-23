// My Movies (Rated Items) Page Module
import { state } from '../utils/state.js';
import { renderGrid } from './shared.js';

export function renderMyMoviesPage(renderPageCallback) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `<h2 class="section-title">My Rated Collection</h2>`;
    mainContent.appendChild(header);

    const myMoviesList = state.myMovies.filter(i => i.type === 'movie' || !i.type);
    const mySeriesList = state.myMovies.filter(i => i.type === 'series');

    if (state.myMovies.length === 0) {
        mainContent.innerHTML += `<p>You haven't rated any movies or series yet.</p>`;
    } else {
        if (myMoviesList.length > 0) {
            mainContent.innerHTML += `<h3 style="margin: 24px 0 16px; color: var(--accent-color);">Movies</h3>`;
            mainContent.appendChild(renderGrid(myMoviesList, true, renderPageCallback));
        }
        if (mySeriesList.length > 0) {
            mainContent.innerHTML += `<h3 style="margin: 24px 0 16px; color: var(--accent-color);">Series</h3>`;
            mainContent.appendChild(renderGrid(mySeriesList, true, renderPageCallback));
        }
    }
}
