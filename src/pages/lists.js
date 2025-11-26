// Lists (Watchlist) Page Module
import { state, createList } from '../utils/state.js';
import { movies, series } from '../data/movies.js';
import { renderGrid } from './shared.js';
import { showToast } from '../components/toast.js';

export function renderListsPage(renderPageCallback) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    // Header with Create Button
    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
        <h2 class="section-title">Your Lists</h2>
        <button id="create-list-btn" class="btn-primary">+ Create New List</button>
    `;
    mainContent.appendChild(header);

    // Custom Lists Section
    const customListsContainer = document.createElement('div');
    customListsContainer.style.marginBottom = '48px';

    if (state.customLists && state.customLists.length > 0) {
        state.customLists.forEach(list => {
            const listEl = document.createElement('div');
            listEl.style.marginBottom = '24px';
            listEl.innerHTML = `
                <h3 style="font-size: 1.2rem; margin-bottom: 16px; color: var(--accent-color);">${list.name} <span style="color: var(--text-secondary); font-size: 0.9rem;">(${list.items.length} items)</span></h3>
            `;
            listEl.appendChild(renderGrid(list.items, false, renderPageCallback));
            customListsContainer.appendChild(listEl);
        });
    } else {
        customListsContainer.innerHTML = `<p style="color: var(--text-muted); font-style: italic;">You haven't created any custom lists yet.</p>`;
    }
    mainContent.appendChild(customListsContainer);

    // Watchlist Section (Default)
    const watchlistHeader = document.createElement('div');
    watchlistHeader.className = 'section-header';
    watchlistHeader.style.marginBottom = '16px';
    watchlistHeader.style.borderTop = '1px solid var(--bg-tertiary)';
    watchlistHeader.style.paddingTop = '24px';

    watchlistHeader.innerHTML = `
        <h2 class="section-title">Watchlist</h2>
        <div style="display: flex; align-items: center; gap: 12px;">
            <label style="color: var(--text-secondary); font-size: 0.9rem;">Sort by:</label>
            <select id="watchlist-sort-select" class="sort-select">
                <option value="rating">Rating</option>
                <option value="name">Name</option>
                <option value="year">Year</option>
            </select>
        </div>
    `;
    mainContent.appendChild(watchlistHeader);

    const watchlistContainer = document.createElement('div');
    watchlistContainer.id = 'watchlist-grid-container';

    if (state.watchlist.length === 0) {
        watchlistContainer.innerHTML = `<p>Your watchlist is empty.</p>`;
    } else {
        // Initial sort by rating
        const sortedWatchlist = [...state.watchlist].sort((a, b) => b.rating - a.rating);
        watchlistContainer.appendChild(renderGrid(sortedWatchlist, false, renderPageCallback));
    }
    mainContent.appendChild(watchlistContainer);

    // Sort Handler
    const sortSelect = document.getElementById('watchlist-sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            let sortedData = [...state.watchlist];

            if (sortBy === 'name') {
                sortedData.sort((a, b) => a.title.localeCompare(b.title));
            } else if (sortBy === 'rating') {
                sortedData.sort((a, b) => b.rating - a.rating);
            } else if (sortBy === 'year') {
                sortedData.sort((a, b) => b.year - a.year);
            }

            watchlistContainer.innerHTML = '';
            watchlistContainer.appendChild(renderGrid(sortedData, false, renderPageCallback));
        });
    }

    // Create List Modal Logic
    document.getElementById('create-list-btn').addEventListener('click', () => {
        showCreateListModal(renderPageCallback);
    });
}

function showCreateListModal(renderPageCallback) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'list-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'list-modal';

    let selectedItems = [];
    const allItems = [...movies, ...series];

    modal.innerHTML = `
        <div class="list-modal-header">
            <h3>Create New List</h3>
            <button class="detail-modal-close" style="position: static;">&times;</button>
        </div>
        
        <div class="list-modal-body">
            <div class="form-group" style="margin-bottom: 12px;">
                <label class="form-label" style="font-size: 0.85rem;">List Name</label>
                <input type="text" id="list-name-input" class="form-input" placeholder="e.g., Weekend Vibes" style="padding: 8px;">
            </div>

            <div class="form-group" style="margin-bottom: 8px;">
                <label class="form-label" style="font-size: 0.85rem;">Add Movies & Series</label>
                <input type="text" id="item-search" class="form-input" placeholder="Search..." style="padding: 8px;">
            </div>

            <div id="selection-list" class="selection-list-container">
                <!-- Items will be rendered here -->
            </div>

            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px;">Selected Items:</div>
            <div id="selected-preview" class="selected-preview-container">
                <span style="color: var(--text-muted); font-size: 0.8rem; align-self: center;">No items selected</span>
            </div>
        </div>

        <div class="list-modal-footer">
            <button class="btn-cancel" id="cancel-list-btn">Cancel</button>
            <button class="btn-primary" id="save-list-btn">Save List</button>
        </div>
    `;

    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    // Animate in
    requestAnimationFrame(() => modalOverlay.classList.add('active'));

    // Close handlers
    const closeModal = () => modalOverlay.remove();
    modal.querySelector('.detail-modal-close').onclick = closeModal;
    document.getElementById('cancel-list-btn').onclick = closeModal;

    // Render List Logic
    const renderSelectionList = (filterText = '') => {
        const listContainer = document.getElementById('selection-list');
        listContainer.innerHTML = '';
        const filtered = allItems.filter(item => item.title.toLowerCase().includes(filterText.toLowerCase()));

        filtered.forEach(item => {
            const isSelected = selectedItems.find(i => i.id === item.id);
            const itemEl = document.createElement('div');
            itemEl.className = 'selection-item';
            itemEl.innerHTML = `
                <img src="${item.poster}" class="selection-thumb">
                <div class="selection-info">
                    <div class="selection-title">${item.title}</div>
                    <div class="selection-meta">${item.year} • ${item.genre}</div>
                </div>
                <button class="add-item-btn ${isSelected ? 'added' : ''}">
                    ${isSelected ? '+' : '+'}
                </button>
            `;

            itemEl.querySelector('.add-item-btn').onclick = (e) => {
                const btn = e.currentTarget;
                if (selectedItems.find(i => i.id === item.id)) {
                    selectedItems = selectedItems.filter(i => i.id !== item.id);
                    btn.classList.remove('added');
                } else {
                    selectedItems.push(item);
                    btn.classList.add('added');
                }
                updatePreview();
            };
            listContainer.appendChild(itemEl);
        });
    };

    const updatePreview = () => {
        const preview = document.getElementById('selected-preview');
        if (selectedItems.length === 0) {
            preview.innerHTML = `<span style="color: var(--text-muted); font-size: 0.8rem; align-self: center;">No items selected</span>`;
            return;
        }

        preview.innerHTML = '';
        selectedItems.forEach(item => {
            const chip = document.createElement('div');
            chip.className = 'selected-preview-item';
            chip.innerHTML = `
                ${item.title}
                <button class="remove-item-chip-btn" aria-label="Remove">&times;</button>
            `;

            chip.querySelector('.remove-item-chip-btn').onclick = () => {
                // Remove item
                selectedItems = selectedItems.filter(i => i.id !== item.id);
                updatePreview();

                // Update list button state if visible
                // We need to re-render the list or find the specific button
                // Re-rendering is safer to ensure consistency
                const searchInput = document.getElementById('item-search');
                if (searchInput) {
                    renderSelectionList(searchInput.value);
                } else {
                    renderSelectionList();
                }
            };

            preview.appendChild(chip);
        });
    };

    // Initial Render
    renderSelectionList();
    updatePreview(); // Call initially to show "No items selected" or any pre-selected items

    // Search Handler
    document.getElementById('item-search').addEventListener('input', (e) => {
        renderSelectionList(e.target.value);
    });

    // Save List
    document.getElementById('save-list-btn').onclick = () => {
        const name = document.getElementById('list-name-input').value;
        if (!name) {
            showToast('Please enter a list name', 'warning');
            return;
        }
        if (selectedItems.length === 0) {
            showToast('Please select at least one item', 'warning');
            return;
        }

        createList(name, selectedItems);
        showToast(`List "${name}" created!`, 'success');
        closeModal();
        renderListsPage(renderPageCallback);
    };
}
