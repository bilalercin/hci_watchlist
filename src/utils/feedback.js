// Enhanced Feedback System - Rule #3: Informative Feedback
import { showToast } from '../components/toast.js';

// Loading state manager
class LoadingManager {
    constructor() {
        this.loadingElement = null;
    }

    show(message = 'Loading...') {
        if (this.loadingElement) return;

        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'loading-overlay';
        this.loadingElement.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(this.loadingElement);
    }

    hide() {
        if (this.loadingElement) {
            this.loadingElement.remove();
            this.loadingElement = null;
        }
    }
}

export const loadingManager = new LoadingManager();

// Action History for Undo - Rule #6: Permit Easy Reversal of Actions
class ActionHistory {
    constructor() {
        this.history = [];
        this.maxHistory = 10;
    }

    addAction(action) {
        this.history.push({
            ...action,
            timestamp: Date.now()
        });

        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    getLastAction() {
        return this.history[this.history.length - 1];
    }

    canUndo() {
        return this.history.length > 0;
    }

    undo() {
        if (this.canUndo()) {
            const lastAction = this.history.pop();
            return lastAction;
        }
        return null;
    }

    clear() {
        this.history = [];
    }
}

export const actionHistory = new ActionHistory();

// Enhanced feedback functions
export function showSuccessFeedback(message, undoCallback = null) {
    const action = undoCallback ? {
        label: 'Undo',
        callback: () => {
            undoCallback();
            showToast('Action undone', 'info');
        }
    } : null;

    showToast(`✓ ${message}`, 'success', action);
}

export function showErrorFeedback(message, helpText = null) {
    const fullMessage = helpText ? `${message}\n${helpText}` : message;
    showToast(fullMessage, 'error');
}

export function showInfoFeedback(message) {
    showToast(message, 'info');
}

// Confirmation Dialog - Rule #4: Design Dialogue to Yield Closure
export function showConfirmDialog(title, message, onConfirm, onCancel = null) {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog-overlay';
        dialog.innerHTML = `
            <div class="confirm-dialog">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="confirm-dialog-actions">
                    <button class="btn-secondary" data-action="cancel">Cancel</button>
                    <button class="btn-primary" data-action="confirm">Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        const handleAction = (confirmed) => {
            dialog.remove();
            if (confirmed) {
                onConfirm && onConfirm();
                resolve(true);
            } else {
                onCancel && onCancel();
                resolve(false);
            }
        };

        dialog.querySelector('[data-action="confirm"]').addEventListener('click', () => handleAction(true));
        dialog.querySelector('[data-action="cancel"]').addEventListener('click', () => handleAction(false));

        // ESC key support - Rule #2: Shortcuts
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                handleAction(false);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Click outside to cancel
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                handleAction(false);
            }
        });
    });
}

// Visual feedback utilities
export function addButtonFeedback(button, action) {
    const originalContent = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span class="btn-loading"></span>';

    return async () => {
        try {
            await action();
            button.innerHTML = '✓';
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.disabled = false;
            }, 1000);
        } catch (error) {
            button.innerHTML = originalContent;
            button.disabled = false;
            throw error;
        }
    };
}
