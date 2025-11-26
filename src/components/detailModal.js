// Detail Modal Component
import { state, addToWatchlist, removeFromWatchlist } from '../utils/state.js';
import { showToast } from './toast.js';

import { t } from '../utils/translations.js';

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
          <span class="detail-genre">${t(item.genre)}</span>
          <span class="detail-divider">•</span>
          <span class="detail-rating">★ ${item.rating}</span>
        </div>
        ${item.director ? `<div class="detail-director-small">${t('directedBy')} <strong>${item.director}</strong></div>` : ''}
        ${item.platform ? `<div class="detail-platform">${t('availableOn')}: <strong>${item.platform}</strong></div>` : ''}
        ${(state.language === 'tr' && item.descriptionTr) ? `<p class="detail-description">${item.descriptionTr}</p>` : (item.description ? `<p class="detail-description">${item.description}</p>` : '')}
        ${item.cast && item.cast.length > 0 ? `
          <div class="detail-cast">
            <h3>${t('cast')}</h3>
            <p>${item.cast.join(', ')}</p>
          </div>
        ` : ''}
        <div class="detail-actions">
          <button class="detail-action-btn watchlist-btn ${isInWatchlist ? 'in-watchlist' : ''}" id="modal-watchlist-btn">
            ${isInWatchlist ? t('inWatchlist') : t('addToWatchlist')}
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
  };

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
      document.removeEventListener('keydown', handleEscape);
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
      watchlistBtn.textContent = t('addToWatchlist');
      watchlistBtn.classList.remove('in-watchlist');
      showToast(t('removedFromWatchlist', { title: item.title }), 'undo', {
        label: t('undo'),
        callback: () => {
          addToWatchlist(item);
          watchlistBtn.textContent = t('inWatchlist');
          watchlistBtn.classList.add('in-watchlist');
          showToast(t('restored', { title: item.title }), 'success');
          if (renderPageCallback) renderPageCallback(state.currentPage);
        }
      });
    } else {
      // Add to watchlist
      const added = addToWatchlist(item);
      if (added) {
        watchlistBtn.textContent = t('inWatchlist');
        watchlistBtn.classList.add('in-watchlist');
        showToast(t('addedToWatchlist', { title: item.title }), 'success');
      } else {
        showToast(t('alreadyInWatchlist', { title: item.title }), 'warning');
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
