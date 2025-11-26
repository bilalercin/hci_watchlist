// Shared Components for Pages
import { state, addToWatchlist, removeFromWatchlist, undoRemove, addOrUpdateRating } from '../utils/state.js';
import { showToast } from '../components/toast.js';
import { showDetailModal } from '../components/detailModal.js';

// Rating Modal
export function openRatingModal(item, renderPageCallback) {
  const existing = state.myMovies.find(i => i.id === item.id);
  let currentRating = existing ? existing.userRating : 0;
  const currentComment = existing ? existing.userComment : '';

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

  // Create star rating HTML
  const starsHtml = `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
      <div class="star-rating" id="star-rating-container"></div>
      <div id="rating-display">${currentRating > 0 ? currentRating.toFixed(1) + ' / 5.0' : 'Click to rate'}</div>
    </div>
  `;

  modal.innerHTML = `
    <h3 style="margin-bottom: 24px; text-align: center;">Rate ${item.title}</h3>
    <div style="margin-bottom: 24px; display: flex; justify-content: center;">
      ${starsHtml}
    </div>
    <div style="margin-bottom: 24px;">
      <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); text-align: left;">Comment</label>
      <textarea id="comment-input" rows="4" style="width: 100%; padding: 8px; background: var(--bg-tertiary); border: none; color: white; border-radius: 4px;">${currentComment}</textarea>
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 8px;">
      <button id="cancel-btn" class="btn-cancel">Cancel</button>
      <button id="save-btn" class="btn-primary">Save</button>
    </div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  const starContainer = document.getElementById('star-rating-container');
  const ratingDisplay = document.getElementById('rating-display');

  // Set initial width
  starContainer.style.setProperty('--rating-width', `${(currentRating / 5) * 100}%`);

  // Handle mouse interaction
  starContainer.addEventListener('mousemove', (e) => {
    const rect = starContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (x / rect.width) * 100));

    // Snap to 0.5 (10% increments)
    let rating = Math.ceil((percent / 100) * 10) / 2;
    rating = Math.max(0.5, Math.min(5, rating)); // Min 0.5, Max 5

    const snapPercent = (rating / 5) * 100;
    starContainer.style.setProperty('--rating-width', `${snapPercent}%`);

    ratingDisplay.textContent = `${rating.toFixed(1)} / 5.0`;
    ratingDisplay.style.color = '#FFD700';
  });

  starContainer.addEventListener('mouseleave', () => {
    const snapPercent = (currentRating / 5) * 100;
    starContainer.style.setProperty('--rating-width', `${snapPercent}%`);
    ratingDisplay.textContent = currentRating > 0 ? `${currentRating.toFixed(1)} / 5.0` : 'Click to rate';
    ratingDisplay.style.color = currentRating > 0 ? '#FFD700' : 'var(--text-muted)';
  });

  starContainer.addEventListener('click', (e) => {
    const rect = starContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Calculate rating based on click position
    let rating = Math.ceil((x / rect.width) * 10) / 2;
    currentRating = Math.max(0.5, Math.min(5, rating));

    const snapPercent = (currentRating / 5) * 100;
    starContainer.style.setProperty('--rating-width', `${snapPercent}%`);

    // Pulse animation
    starContainer.style.transform = 'scale(1.1)';
    setTimeout(() => starContainer.style.transform = 'scale(1)', 150);

    ratingDisplay.textContent = `${currentRating.toFixed(1)} / 5.0`;
    ratingDisplay.style.color = '#FFD700';
  });


  // Cancel button (Rule 6: Reversal)
  document.getElementById('cancel-btn').onclick = () => modalOverlay.remove();

  // Save button (Rule 3: Feedback, Rule 5: Error Prevention)
  document.getElementById('save-btn').onclick = () => {
    const comment = document.getElementById('comment-input').value;

    if (currentRating === 0) {
      ratingDisplay.textContent = 'Please select a rating!';
      ratingDisplay.style.color = 'var(--danger-color)';
      starContainer.style.animation = 'shake 0.3s';
      setTimeout(() => starContainer.style.animation = '', 300);
      return;
    }

    addOrUpdateRating(item, currentRating, comment);
    showToast(`Saved rating for ${item.title}`, 'success');
    modalOverlay.remove();
    if (state.currentPage === 'my-movies') renderPageCallback('my-movies');
  };
}

// Create Card Component
export function createCard(item, isMyMovies = false, renderPageCallback) {
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
    const ratingPercent = (item.userRating / 5) * 100;
    userRatingHtml = `
      <div style="margin-bottom: 8px;">
        <div style="color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 4px;">Your Rating:</div>
        <div class="star-rating small" style="--rating-width: ${ratingPercent}%;"></div>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px; font-style: italic;">"${item.userComment}"</div>
    `;
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
      <button class="rate-btn" style="padding: 8px; background: var(--bg-tertiary); border: none; border-radius: 4px; cursor: pointer; color: var(--text-primary); display: flex; align-items: center; justify-content: center;">
        ★
      </button>
    </div>
  `;

  const btn = card.querySelector('.action-btn');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isWatched) {
      const removed = removeFromWatchlist(item.id);
      if (removed) {
        showToast(`Removed ${removed.title}`, 'undo', {
          label: 'Undo',
          callback: () => {
            undoRemove();
            renderPageCallback(state.currentPage);
            showToast(`Restored ${removed.title}`, 'success');
          }
        });
        renderPageCallback(state.currentPage);
      }
    } else {
      const added = addToWatchlist(item);
      if (added) {
        showToast(`Added ${item.title} to watchlist`, 'success');
      } else {
        showToast(`${item.title} is already in your watchlist`, 'warning');
      }
      renderPageCallback(state.currentPage);
    }
  });

  const rateBtn = card.querySelector('.rate-btn');
  rateBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openRatingModal(item, renderPageCallback);
  });

  // Click card to show details
  card.addEventListener('click', () => {
    showDetailModal(item, renderPageCallback, openRatingModal);
  });

  return card;
}

// Render Grid
export function renderGrid(items, isMyMovies = false, renderPageCallback) {
  const grid = document.createElement('div');
  grid.className = 'grid-container';

  if (items.length === 0) {
    grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">No items found.</p>`;
  } else {
    items.forEach(item => {
      grid.appendChild(createCard(item, isMyMovies, renderPageCallback));
    });
  }
  return grid;
}
