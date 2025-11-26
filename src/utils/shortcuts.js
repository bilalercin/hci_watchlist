// Keyboard Shortcuts System - Rule #2: Enable Frequent Users to Use Shortcuts

class ShortcutManager {
    constructor() {
        this.shortcuts = new Map();
        this.helpVisible = false;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.createHelpOverlay();
    }

    register(key, description, handler, modifier = null) {
        const shortcutKey = modifier ? `${modifier}+${key}` : key;
        this.shortcuts.set(shortcutKey, {
            key,
            modifier,
            description,
            handler
        });
    }

    handleKeydown(e) {
        // Don't trigger shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Exception: ESC key should work everywhere
            if (e.key !== 'Escape') {
                return;
            }
        }

        const key = e.key.toLowerCase();
        const modifier = e.ctrlKey ? 'ctrl' : e.metaKey ? 'cmd' : e.altKey ? 'alt' : null;
        const shortcutKey = modifier ? `${modifier}+${key}` : key;

        const shortcut = this.shortcuts.get(shortcutKey);
        if (shortcut) {
            e.preventDefault();
            shortcut.handler(e);
        }

        // Show help overlay with '?'
        if (e.key === '?' && !modifier) {
            e.preventDefault();
            this.toggleHelp();
        }
    }

    createHelpOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'keyboard-shortcuts-help';
        overlay.className = 'keyboard-help-overlay hidden';
        overlay.innerHTML = `
            <div class="keyboard-help-dialog">
                <div class="keyboard-help-header">
                    <h2>⌨️ Keyboard Shortcuts</h2>
                    <button class="close-help-btn" aria-label="Close help">×</button>
                </div>
                <div class="keyboard-help-content" id="shortcuts-list">
                    <!-- Will be populated dynamically -->
                </div>
                <div class="keyboard-help-footer">
                    <p>Press <kbd>?</kbd> to toggle this help</p>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Close button handler
        overlay.querySelector('.close-help-btn').addEventListener('click', () => {
            this.toggleHelp();
        });

        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.toggleHelp();
            }
        });
    }

    toggleHelp() {
        this.helpVisible = !this.helpVisible;
        const overlay = document.getElementById('keyboard-shortcuts-help');

        if (this.helpVisible) {
            this.updateHelpContent();
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    updateHelpContent() {
        const list = document.getElementById('shortcuts-list');
        let html = '<div class="shortcuts-grid">';

        this.shortcuts.forEach((shortcut, key) => {
            const displayKey = shortcut.modifier
                ? `<kbd>${shortcut.modifier}</kbd> + <kbd>${shortcut.key.toUpperCase()}</kbd>`
                : `<kbd>${shortcut.key === ' ' ? 'Space' : shortcut.key.toUpperCase()}</kbd>`;

            html += `
                <div class="shortcut-item">
                    <div class="shortcut-keys">${displayKey}</div>
                    <div class="shortcut-desc">${shortcut.description}</div>
                </div>
            `;
        });

        html += '</div>';
        list.innerHTML = html;
    }

    unregister(key, modifier = null) {
        const shortcutKey = modifier ? `${modifier}+${key}` : key;
        this.shortcuts.delete(shortcutKey);
    }

    clear() {
        this.shortcuts.clear();
    }
}

export const shortcutManager = new ShortcutManager();

// Register default shortcuts
export function initializeDefaultShortcuts(renderPage, closeModal) {
    // Navigation shortcuts
    shortcutManager.register('1', 'Go to Movies', () => renderPage('movies'));
    shortcutManager.register('2', 'Go to Series', () => renderPage('series'));
    shortcutManager.register('3', 'Go to Lists', () => renderPage('lists'));
    shortcutManager.register('4', 'Go to Rated Content', () => renderPage('my-movies'));
    shortcutManager.register('5', 'Go to Profile', () => renderPage('profile'));

    // Search shortcut
    shortcutManager.register('/', 'Focus search', () => {
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    });

    // ESC to close modals and clear search
    shortcutManager.register('escape', 'Close modal or clear search', () => {
        const searchInput = document.getElementById('global-search');
        if (document.activeElement === searchInput && searchInput.value) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        } else if (searchInput === document.activeElement) {
            searchInput.blur();
        } else if (closeModal) {
            closeModal();
        }
    });

    // Refresh current page
    shortcutManager.register('r', 'Refresh page', () => {
        window.location.reload();
    });
}

// Tooltip helper to show shortcuts on hover
export function addShortcutTooltip(element, shortcut) {
    element.setAttribute('data-shortcut', shortcut);
    element.setAttribute('title', `Shortcut: ${shortcut}`);
}
