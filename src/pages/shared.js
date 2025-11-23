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

  // Create star rating HTML with half-star support
  let starsHtml = '<div class="star-rating" id="star-container">';
  for (let i = 1; i <= 5; i++) {
    const fullFilled = i <= Math.floor(currentRating) ? 'filled' : '';
    const halfFilled = (i - 0.5) === currentRating ? 'half-filled' : '';
    starsHtml += `
      <span class="star-wrapper" data-star="${i}">
        <span class="star half-star ${halfFilled}" data-value="${i - 0.5}">★</span>
        <span class="star full-star ${fullFilled}" data-value="${i}">★</span>
      </span>
    `;
  }
  starsHtml += '</div>';
  starsHtml += '<div id="rating-display" style="text-align: center; margin-top: 8px; color: var(--warning-color); font-weight: 600; min-height: 24px;">' +
    (currentRating > 0 ? `${currentRating.toFixed(1)} / 5.0` : 'Click to rate') + '</div>';

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
      <button id="cancel-btn" class="btn-cancel">Cancel</button>
      <button id="save-btn" class="btn-primary">Save</button>
    </div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  const starContainer = document.getElementById('star-container');
  const stars = starContainer.querySelectorAll('.star');
  const starWrappers = starContainer.querySelectorAll('.star-wrapper');
  const ratingDisplay = document.getElementById('rating-display');

  // Update visual state of stars
  const updateStars = (rating) => {
    stars.forEach(star => {
      const val = parseFloat(star.dataset.value);
      star.classList.remove('filled', 'half-filled', 'hover');

      if (val <= rating) {
        if (val % 1 === 0.5 && val === rating) {
          star.classList.add('half-filled');
        } else if (val <= Math.floor(rating) || val === rating) {
          star.classList.add('filled');
        }
      }
    });
  };

  // Initial star state
  updateStars(currentRating);

  // Hover effect on wrapper (Rule 3: Feedback)
  starWrappers.forEach(wrapper => {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const isLeftHalf = x < rect.width / 2;
      const starNum = parseInt(wrapper.dataset.star);
      const hoverValue = isLeftHalf ? starNum - 0.5 : starNum;

      ratingDisplay.textContent = `${hoverValue.toFixed(1)} / 5.0`;
      ratingDisplay.style.color = 'var(--accent-color)';

      // Show hover state
      stars.forEach(star => {
        const val = parseFloat(star.dataset.value);
        star.classList.remove('hover');
        if (val <= hoverValue) {
          star.classList.add('hover');
        }
      });
    });

    wrapper.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hover'));
      ratingDisplay.textContent = currentRating > 0 ? `${currentRating.toFixed(1)} / 5.0` : 'Click to rate';
      ratingDisplay.style.color = 'var(--warning-color)';
    });

    // Click to select rating (Rule 3: Feedback)
    wrapper.addEventListener('click', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const isLeftHalf = x < rect.width / 2;
      const starNum = parseInt(wrapper.dataset.star);
      currentRating = isLeftHalf ? starNum - 0.5 : starNum;

      updateStars(currentRating);
      ratingDisplay.textContent = `${currentRating.toFixed(1)} / 5.0`;
      ratingDisplay.style.color = 'var(--warning-color)';
    });
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
