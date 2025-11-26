// Profile Page Module
import { state, updateUserProfile, setEditingProfile } from '../utils/state.js';
import { showToast } from '../components/toast.js';
import { updateProfileImage } from '../components/navbar.js';

export function renderProfilePage(renderPageCallback) {
  const mainContent = document.getElementById('main-content');
  const isEditing = state.isEditingProfile || false;

  if (!isEditing) {
    // --- VIEW MODE ---
    mainContent.innerHTML = `
      <div class="profile-card">
        <div class="profile-header" style="justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 24px;">
            <img src="${state.userProfile.photo}" alt="Profile" class="profile-avatar-large">
            <div>
              <h2 style="margin-bottom: 4px;">${state.userProfile.firstName} ${state.userProfile.lastName}</h2>
              <p style="color: var(--text-muted); margin-bottom: 8px;">Member since 2024</p>
              
              <!-- Gamification Section -->
              ${(() => {
        const ratedCount = state.myMovies.length;
        const levels = [
          { name: 'Viewer', threshold: 0 },
          { name: 'Movie Buff', threshold: 5 },
          { name: 'Critic', threshold: 10 },
          { name: 'Cinephile', threshold: 20 }
        ];

        let currentLevel = levels[0];
        let nextLevel = levels[1];

        for (let i = 0; i < levels.length; i++) {
          if (ratedCount >= levels[i].threshold) {
            currentLevel = levels[i];
            nextLevel = levels[i + 1] || null;
          }
        }

        let progressPercent = 100;
        let progressText = 'Max Level';

        if (nextLevel) {
          const range = nextLevel.threshold - currentLevel.threshold;
          const progress = ratedCount - currentLevel.threshold;
          progressPercent = Math.min(100, Math.max(0, (progress / range) * 100));
          progressText = `${ratedCount} / ${nextLevel.threshold} to ${nextLevel.name}`;
        }

        return `
                    <div class="level-container">
                        <div class="level-header">
                            <span class="level-label">Current Rank:</span>
                            <span class="level-badge">${currentLevel.name}</span>
                            <button id="level-info-btn" class="info-btn" title="View Ranks">i</button>
                            
                            <!-- Info Popup -->
                            <div id="level-popup" class="level-popup">
                                <h4>Rank System</h4>
                                <ul class="level-list">
                                    ${levels.map(l => `
                                        <li class="${l.name === currentLevel.name ? 'active' : ''}">
                                            <span>${l.name}</span>
                                            <span>${l.threshold}+ rated</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                        
                        <div class="level-progress-wrapper" title="${progressText}">
                            <div class="level-progress-bar" style="width: ${progressPercent}%"></div>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                            ${nextLevel ? `${nextLevel.threshold - ratedCount} more ratings to reach <strong>${nextLevel.name}</strong>` : 'You have reached the top rank!'}
                        </div>
                    </div>
                  `;
      })()}
            </div>
          </div>
          <button id="edit-profile-btn" class="edit-btn" title="Edit Profile">
            ✎
          </button>
        </div>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--bg-tertiary);">
          <h3 style="margin-bottom: 16px;">Stats</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div id="watchlist-stat" style="background: var(--bg-tertiary); padding: 16px; border-radius: 8px; text-align: center; cursor: pointer; transition: background-color 0.2s;">
              <div style="font-size: 1.5rem; font-weight: bold; color: var(--accent-color);">${state.watchlist.length}</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">Watchlist</div>
            </div>
            <div id="rated-stat" style="background: var(--bg-tertiary); padding: 16px; border-radius: 8px; text-align: center; cursor: pointer; transition: background-color 0.2s;">
              <div style="font-size: 1.5rem; font-weight: bold; color: var(--accent-color);">${state.myMovies.length}</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">Rated Items</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Hover effects for stats (Rule 3: Feedback)
    const addHoverEffect = (id) => {
      const el = document.getElementById(id);
      el.addEventListener('mouseenter', () => el.style.backgroundColor = 'var(--bg-primary)');
      el.addEventListener('mouseleave', () => el.style.backgroundColor = 'var(--bg-tertiary)');
    };
    addHoverEffect('watchlist-stat');
    addHoverEffect('rated-stat');

    // Gamification Info Popup
    const infoBtn = document.getElementById('level-info-btn');
    const levelPopup = document.getElementById('level-popup');

    if (infoBtn && levelPopup) {
      infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        levelPopup.classList.toggle('active');
      });

      // Close popup when clicking outside
      document.addEventListener('click', (e) => {
        if (!levelPopup.contains(e.target) && e.target !== infoBtn) {
          levelPopup.classList.remove('active');
        }
      });
    }

    // Navigation logic
    document.getElementById('watchlist-stat').addEventListener('click', () => {
      if (renderPageCallback) renderPageCallback('lists');
    });

    document.getElementById('rated-stat').addEventListener('click', () => {
      if (renderPageCallback) renderPageCallback('my-movies');
    });

    document.getElementById('edit-profile-btn').addEventListener('click', () => {
      setEditingProfile(true);
      renderProfilePage(renderPageCallback);
    });

  } else {
    // --- EDIT MODE ---
    mainContent.innerHTML = `
      <div class="profile-card">
        <h3 style="margin-bottom: 24px;">Edit Profile</h3>
        
        <div style="display: flex; justify-content: center; margin-bottom: 24px;">
          <div class="avatar-upload-container" id="avatar-container">
            <img src="${state.userProfile.photo}" id="avatar-preview" class="profile-avatar-large">
            <div class="avatar-upload-overlay">📷</div>
            <input type="file" id="file-input" accept="image/*" style="display: none;">
          </div>
        </div>

        <form id="profile-form">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input type="text" class="form-input" id="firstName" value="${state.userProfile.firstName}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <input type="text" class="form-input" id="lastName" value="${state.userProfile.lastName}">
          </div>
          
          <div style="display: flex; gap: 12px; margin-top: 32px;">
            <button type="button" id="cancel-edit-btn" class="btn-secondary" style="flex: 1;">Cancel</button>
            <button type="submit" class="btn-primary" style="flex: 1;">Save Changes</button>
          </div>
        </form>
      </div>
    `;

    // File Upload Logic
    const fileInput = document.getElementById('file-input');
    const avatarContainer = document.getElementById('avatar-container');
    const avatarPreview = document.getElementById('avatar-preview');
    let newPhotoUrl = state.userProfile.photo;

    avatarContainer.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          newPhotoUrl = readerEvent.target.result;
          avatarPreview.src = newPhotoUrl;
        };
        reader.readAsDataURL(file);
      }
    });

    document.getElementById('cancel-edit-btn').addEventListener('click', () => {
      setEditingProfile(false);
      renderProfilePage(renderPageCallback);
    });

    // Shortcuts (Rule 2) & Reversal (Rule 6)
    const profileForm = document.getElementById('profile-form');

    profileForm.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setEditingProfile(false);
        renderProfilePage(renderPageCallback);
      }
    });

    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();

      // Feedback & Error Handling (Rule 3 & 5)
      if (!firstName) {
        showToast('First Name is required!', 'undo');
        document.getElementById('firstName').focus();
        return;
      }

      updateUserProfile(firstName, lastName, newPhotoUrl);
      setEditingProfile(false);

      // Update Navbar
      updateProfileImage(newPhotoUrl);

      showToast('Profile updated successfully', 'success');
      renderProfilePage(renderPageCallback);
    });
  }
}
