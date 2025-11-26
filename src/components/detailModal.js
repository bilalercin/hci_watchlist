// Detail Modal Component
import { state, addToWatchlist, removeFromWatchlist } from '../utils/state.js';
import { showToast } from './toast.js';
import { showSuccessFeedback, showErrorFeedback } from '../utils/feedback.js';
import { setModalCloseHandler, clearModalCloseHandler } from '../main.js';

export function showDetailModal(item, renderPageCallback, openRatingModalCallback) {
  // Check if item is in watchlist
  const isInWatchlist = state.watchlist.find(i => i.id === item.id);

  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'detail-modal-overlay';

  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'detail-modal';

  modal.innerHTML = `
    <button class="detail-modal-close" aria-label="Close">&times;</button>
    <div class="detail-modal-content">
      <div class="detail-modal-poster">
        <img src="${item.poster}" alt="${item.title}">
      </div>
      <div class="detail-modal-info">
        <h2>${item.title}</h2>
        <div class="detail-meta">
          <span class="detail-year">${item.year}</span>
          <span class="detail-divider">•</span>
          <span class="detail-genre">${item.genre}</span>
          <span class="detail-divider">•</span>
          <span class="detail-rating">★ ${item.rating}</span>
        </div>
        ${item.platform ? `<div class="detail-platform">Available on: <strong>${item.platform}</strong></div>` : ''}
        ${item.description ? `<p class="detail-description">${item.description}</p>` : ''}
        ${item.cast && item.cast.length > 0 ? `
          <div class="detail-cast">
            <h3>Cast</h3>
            <p>${item.cast.join(', ')}</p>
          </div>
        ` : ''}
        <div class="detail-actions">
          <button class="detail-action-btn watchlist-btn ${isInWatchlist ? 'in-watchlist' : ''}" id="modal-watchlist-btn">
            ${isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
          </button>
        </div>
      </div>
    </div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Close handlers
  const closeModal = () => {
    modalOverlay.remove();
    document.body.style.overflow = '';
    clearModalCloseHandler(); // Rule #2: Clear ESC handler
    document.removeEventListener('keydown', handleEscape);
  };

  // Register modal close handler for global shortcuts - Rule #2
  setModalCloseHandler(closeModal);

  // Close button
  modal.querySelector('.detail-modal-close').addEventListener('click', closeModal);

  // Click outside to close
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // ESC key to close (Rule 2: Shortcuts)
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Watchlist button handler (Rule 3: Feedback, Rule 6: Reversal)
  const watchlistBtn = modal.querySelector('#modal-watchlist-btn');
  watchlistBtn.addEventListener('click', () => {
    const isNowInWatchlist = state.watchlist.find(i => i.id === item.id);

    if (isNowInWatchlist) {
      // Remove from watchlist
      removeFromWatchlist(item.id);
      watchlistBtn.textContent = '+ Add to Watchlist';
      watchlistBtn.classList.remove('in-watchlist');
      showToast(`Removed ${item.title} from watchlist`, 'undo', {
        label: 'Undo',
        callback: () => {
          addToWatchlist(item);
          watchlistBtn.textContent = '✓ In Watchlist';
          watchlistBtn.classList.add('in-watchlist');
          showToast(`Restored ${item.title}`, 'success');
          if (renderPageCallback) renderPageCallback(state.currentPage);
        }
      });
    } else {
      // Add to watchlist
      const added = addToWatchlist(item);
      if (added) {
        watchlistBtn.textContent = '✓ In Watchlist';
        watchlistBtn.classList.add('in-watchlist');
        showToast(`Added ${item.title} to watchlist`, 'success');
      } else {
        showToast(`${item.title} is already in your watchlist`, 'warning');
      }
    }

    // Update page if callback provided
    if (renderPageCallback) renderPageCallback(state.currentPage);
  });



  // Animate in
  requestAnimationFrame(() => {
    modalOverlay.classList.add('active');
  });
}
