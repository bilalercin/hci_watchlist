// Profile Page Module
import { state, updateUserProfile, setEditingProfile } from '../utils/state.js';
import { showToast } from '../components/toast.js';
import { updateProfileImage } from '../components/navbar.js';

export function renderProfilePage() {
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
              <p style="color: var(--text-muted);">Member since 2024</p>
            </div>
          </div>
          <button id="edit-profile-btn" class="edit-btn" title="Edit Profile">
            ✎
          </button>
        </div>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--bg-tertiary);">
          <h3 style="margin-bottom: 16px;">Stats</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="background: var(--bg-tertiary); padding: 16px; border-radius: 8px; text-align: center;">
              <div style="font-size: 1.5rem; font-weight: bold; color: var(--accent-color);">${state.watchlist.length}</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">Watchlist</div>
            </div>
            <div style="background: var(--bg-tertiary); padding: 16px; border-radius: 8px; text-align: center;">
              <div style="font-size: 1.5rem; font-weight: bold; color: var(--accent-color);">${state.myMovies.length}</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">Rated Items</div>
            </div>
          </div>
        </div>
      </div>
    `;

        document.getElementById('edit-profile-btn').addEventListener('click', () => {
            setEditingProfile(true);
            renderProfilePage();
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
            renderProfilePage();
        });

        // Shortcuts (Rule 2) & Reversal (Rule 6)
        const profileForm = document.getElementById('profile-form');

        profileForm.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                setEditingProfile(false);
                renderProfilePage();
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
            renderProfilePage();
        });
    }
}
