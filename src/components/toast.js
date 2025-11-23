// Toast Notification System

const toastContainer = document.getElementById('toast-container');

export function showToast(message, type = 'info', action = null) {
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
