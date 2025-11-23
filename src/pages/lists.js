// Lists (Watchlist) Page Module
import { state } from '../utils/state.js';
import { renderGrid } from './shared.js';

export function renderListsPage(renderPageCallback) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `<h2 class="section-title">Your Watchlist</h2>`;
    mainContent.appendChild(header);

    if (state.watchlist.length === 0) {
        mainContent.innerHTML += `<p>Your watchlist is empty.</p>`;
    } else {
        mainContent.appendChild(renderGrid(state.watchlist, false, renderPageCallback));
    }
}
