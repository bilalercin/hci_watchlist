import { movies, series } from './data/movies.js';

// --- State Management ---
const state = {
  watchlist: [],
  myMovies: [], // Stores rated/commented items
  lastRemoved: null,
  currentPage: 'movies',
  filter: {
    genre: 'All',
    type: 'movies' // 'movies' or 'series'
  }
};

// --- DOM Elements ---
const mainContent = document.getElementById('main-content');
const navLinks = document.querySelectorAll('.nav-links a'); // Note: this selects dropdown links too
const toastContainer = document.getElementById('toast-container');
const searchInput = document.getElementById('global-search');

// --- Toast System (Rule 3) ---
function showToast(message, type = 'info', action = null) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let actionHtml = '';
  if (action) {
    actionHtml = `<button class="toast-action">${action.label}</button>`;
  }

  toast.innerHTML = `
    <span class="toast-content">${message}</span>
    ${actionHtml}
  `;

  if (action) {
    toast.querySelector('.toast-action').addEventListener('click', () => {
      action.callback();
      toast.remove();
    });
  }

  toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.isConnected) {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

// --- Logic ---

function addToWatchlist(item) {
  if (state.watchlist.find(i => i.id === item.id)) {
    showToast(`${item.title} is already in your watchlist`, 'warning');
    return;
  }
  state.watchlist.push(item);
  showToast(`Added ${item.title} to watchlist`, 'success');
  renderPage(state.currentPage);
}

function removeFromWatchlist(itemId) {
  const index = state.watchlist.findIndex(i => i.id === itemId);
  if (index > -1) {
    const item = state.watchlist[index];
    state.watchlist.splice(index, 1);
    state.lastRemoved = item;

    showToast(`Removed ${item.title}`, 'undo', {
      label: 'Undo',
      callback: () => {
        state.watchlist.splice(index, 0, item);
        renderPage(state.currentPage);
        showToast(`Restored ${item.title}`, 'success');
      }
    });
    renderPage(state.currentPage);
  }
}

function openRatingModal(item) {
  const existing = state.myMovies.find(i => i.id === item.id);
  let currentRating = existing ? existing.userRating : 0;
  const currentComment = existing ? existing.userComment : '';

  // Create modal dynamically
  const modalOverlay = document.createElement('div');
  modalOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); z-index: 1000;
        display: flex; justify-content: center; align-items: center;
    `;

  const modal = document.createElement('div');
  modal.style.cssText = `
        background: var(--bg-secondary); padding: 24px; border-radius: 8px;
        width: 90%; max-width: 400px; border: 1px solid var(--bg-tertiary);
    `;

  // Generate Stars HTML
  let starsHtml = '<div class="star-rating" id="star-container">';
  for (let i = 1; i <= 5; i++) {
    const filled = i <= currentRating ? 'filled' : '';
    starsHtml += `<span class="star ${filled}" data-value="${i}">★</span>`;
  }
  starsHtml += '</div>';

  modal.innerHTML = `
        <h3 style="margin-bottom: 16px;">Rate ${item.title}</h3>
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Rating</label>
            ${starsHtml}
        </div>
        <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Comment</label>
            <textarea id="comment-input" rows="4" style="width: 100%; padding: 8px; background: var(--bg-tertiary); border: none; color: white; border-radius: 4px;">${currentComment}</textarea>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button id="cancel-btn" style="padding: 8px 16px; background: transparent; border: 1px solid var(--text-muted); color: var(--text-muted); border-radius: 4px; cursor: pointer;">Cancel</button>
            <button id="save-btn" style="padding: 8px 16px; background: var(--accent-color); border: none; color: black; font-weight: bold; border-radius: 4px; cursor: pointer;">Save</button>
        </div>
    `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  // Star Interaction Logic
  const starContainer = document.getElementById('star-container');
  const stars = starContainer.querySelectorAll('.star');

  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      const val = parseInt(star.dataset.value);
      stars.forEach(s => {
        if (parseInt(s.dataset.value) <= val) s.classList.add('hover');
        else s.classList.remove('hover');
      });
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hover'));
    });

    star.addEventListener('click', () => {
      currentRating = parseInt(star.dataset.value);
      stars.forEach(s => {
        if (parseInt(s.dataset.value) <= currentRating) s.classList.add('filled');
        else s.classList.remove('filled');
      });
    });
  });

  document.getElementById('cancel-btn').onclick = () => modalOverlay.remove();
  document.getElementById('save-btn').onclick = () => {
    const comment = document.getElementById('comment-input').value;

    if (currentRating === 0) {
      alert('Please select a rating');
      return;
    }

    const myMovieItem = { ...item, userRating: currentRating, userComment: comment, type: item.id > 100 ? 'series' : 'movie' };

    // Update or Add
    const idx = state.myMovies.findIndex(i => i.id === item.id);
    if (idx > -1) {
      state.myMovies[idx] = myMovieItem;
    } else {
      state.myMovies.push(myMovieItem);
    }

    showToast(`Saved rating for ${item.title}`, 'success');
    modalOverlay.remove();
    if (state.currentPage === 'my-movies') renderPage('my-movies');
  };
}

// --- Rendering ---

function createCard(item, isMyMovies = false) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.style.cssText = `
        background: var(--bg-secondary);
        border-radius: 8px;
        overflow: hidden;
        transition: transform var(--transition-fast);
        cursor: pointer;
        display: flex; flex-direction: column;
    `;

  card.onmouseenter = () => card.style.transform = 'translateY(-4px)';
  card.onmouseleave = () => card.style.transform = 'translateY(0)';

  const isWatched = state.watchlist.find(i => i.id === item.id);
  const btnText = isWatched ? 'Remove' : 'Add Watchlist';
  const extraClass = isWatched ? 'remove' : '';

  let userRatingHtml = '';
  if (isMyMovies && item.userRating) {
    userRatingHtml = `<div style="color: var(--warning-color); margin-bottom: 8px;">Your Rating: ${'★'.repeat(item.userRating)}</div>
                          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px; font-style: italic;">"${item.userComment}"</div>`;
  }

  card.innerHTML = `
        <div style="position: relative; aspect-ratio: 2/3;">
            <img src="${item.poster}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">
                ★ ${item.rating}
            </div>
        </div>
        <div style="padding: 12px; flex: 1; display: flex; flex-direction: column;">
            <h3 style="font-size: 1rem; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</h3>
            <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 12px;">
                <span>${item.year}</span>
                <span>${item.genre}</span>
            </div>
            ${userRatingHtml}
            <div style="margin-top: auto; display: flex; gap: 8px;">
                <button class="action-btn ${extraClass}" style="flex: 1; font-size: 0.8rem;">${btnText}</button>
                <button class="rate-btn" style="padding: 8px; background: var(--bg-tertiary); border: none; border-radius: 4px; cursor: pointer; color: var(--text-primary);">★</button>
            </div>
        </div>
    `;

  const btn = card.querySelector('.action-btn');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isWatched) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  });

  const rateBtn = card.querySelector('.rate-btn');
  rateBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openRatingModal(item);
  });

  return card;
}

function renderGrid(items, isMyMovies = false) {
  const grid = document.createElement('div');
  grid.className = 'grid-container';

  if (items.length === 0) {
    grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">No items found.</p>`;
  } else {
    items.forEach(item => {
      grid.appendChild(createCard(item, isMyMovies));
    });
  }
  return grid;
}

function renderPage(pageName) {
  state.currentPage = pageName;
  mainContent.innerHTML = '';

  // Update Nav Active State
  // Simple check: if pageName matches data-page
  document.querySelectorAll('.nav-links > li > a').forEach(link => {
    if (link.dataset.page === pageName) link.classList.add('active');
    else link.classList.remove('active');
  });

  const header = document.createElement('div');
  header.className = 'section-header';

  if (pageName === 'movies' || pageName === 'series') {
    const title = state.filter.genre === 'All' ?
      (pageName === 'movies' ? 'All Movies' : 'All Series') :
      `${state.filter.genre} ${pageName === 'movies' ? 'Movies' : 'Series'}`;

    header.innerHTML = `<h2 class="section-title">${title}</h2>`;
    mainContent.appendChild(header);

    let data = pageName === 'movies' ? movies : series;
    if (state.filter.genre !== 'All') {
      data = data.filter(i => i.genre === state.filter.genre);
    }
    mainContent.appendChild(renderGrid(data));

  } else if (pageName === 'lists') {
    header.innerHTML = `<h2 class="section-title">Your Watchlist</h2>`;
    mainContent.appendChild(header);
    if (state.watchlist.length === 0) {
      mainContent.innerHTML += `<p>Your watchlist is empty.</p>`;
    } else {
      mainContent.appendChild(renderGrid(state.watchlist));
    }

  } else if (pageName === 'my-movies') {
    header.innerHTML = `<h2 class="section-title">My Rated Collection</h2>`;
    mainContent.appendChild(header);

    const myMoviesList = state.myMovies.filter(i => i.type === 'movie' || !i.type); // Default to movie if type missing
    const mySeriesList = state.myMovies.filter(i => i.type === 'series');

    if (state.myMovies.length === 0) {
      mainContent.innerHTML += `<p>You haven't rated any movies or series yet.</p>`;
    } else {
      if (myMoviesList.length > 0) {
        mainContent.innerHTML += `<h3 style="margin: 24px 0 16px; color: var(--accent-color);">Movies</h3>`;
        mainContent.appendChild(renderGrid(myMoviesList, true));
      }
      if (mySeriesList.length > 0) {
        mainContent.innerHTML += `<h3 style="margin: 24px 0 16px; color: var(--accent-color);">Series</h3>`;
        mainContent.appendChild(renderGrid(mySeriesList, true));
      }
    }

  } else if (pageName === 'profile') {
    mainContent.innerHTML += `
            <div style="background: var(--bg-secondary); padding: 24px; border-radius: 8px;">
                <h3>User Profile</h3>
                <p style="color: var(--text-muted); margin-top: 8px;">Watchlist Count: ${state.watchlist.length}</p>
                <p style="color: var(--text-muted);">Rated Items: ${state.myMovies.length}</p>
            </div>
        `;
  }
}

// --- Event Listeners ---

// Global Click Listener for Navigation (Delegation)
document.querySelector('.nav-links').addEventListener('click', (e) => {
  const target = e.target;
  if (target.tagName === 'A') {
    e.preventDefault();
    const page = target.dataset.page;
    const filter = target.dataset.filter;
    const type = target.dataset.type;

    if (filter && type) {
      // Handle Dropdown Filter Click
      state.filter.genre = filter;
      state.filter.type = type;
      renderPage(type); // 'movies' or 'series'
    } else if (page) {
      // Handle Page Link
      state.filter.genre = 'All'; // Reset filter when switching main pages
      renderPage(page);
    }
  }
});

// Rule 2: Shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
});

// Initial Render
renderPage('movies');
