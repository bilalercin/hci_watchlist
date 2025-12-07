import { state, setCurrentPage, setFilter, setLanguage, setTheme, setBlueLight } from '../utils/state.js';
import { shortcutManager } from '../utils/shortcuts.js';
import { t } from '../utils/translations.js';

export function initializeNavbar(renderPageCallback) {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.textContent = state.language === 'tr' ? 'EN' : 'TR';
        langToggle.addEventListener('click', () => {
            const newLang = state.language === 'tr' ? 'en' : 'tr';
            setLanguage(newLang);
        });
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = state.theme === 'light' ? '🌙' : '☀️';
        themeToggle.title = t('theme');
        themeToggle.addEventListener('click', () => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    const blueLightToggle = document.getElementById('blue-light-toggle');
    if (blueLightToggle) {
        blueLightToggle.textContent = state.blueLight ? '🔵' : '💡';
        blueLightToggle.title = t('blueLight');
        if (state.blueLight) {
            blueLightToggle.style.background = 'rgba(255, 200, 100, 0.3)';
        }
        blueLightToggle.addEventListener('click', () => {
            setBlueLight(!state.blueLight);
        });
    }

    const shortcutsToggle = document.getElementById('shortcuts-toggle');
    if (shortcutsToggle) {
        shortcutsToggle.title = t('shortcuts');
        shortcutsToggle.addEventListener('click', () => {
            shortcutManager.toggleHelp();
        });
    }

    updateNavbarText();

    document.addEventListener('click', (e) => {
        const target = e.target.closest('a');

        if (!target) return;

        if (target.closest('.nav-links') || target.closest('.profile-container') || target.closest('.nav-brand')) {
            e.preventDefault();
            const page = target.dataset.page;
            const filter = target.dataset.filter;
            const type = target.dataset.type;

            if (filter && type) {
                setFilter(filter, type);
                renderPageCallback(type);
            } else if (page) {
                setFilter('All', state.filter.type);
                renderPageCallback(page);
            }
        }
    });

    updateNavActiveState(state.currentPage);
}

function updateNavbarText() {
    document.querySelector('.nav-links [data-page="movies"]').textContent = t('movies');
    document.querySelector('.nav-links [data-page="series"]').textContent = t('series');
    document.querySelector('.nav-links [data-page="lists"]').textContent = t('lists');

    const dropdownItems = document.querySelectorAll('.dropdown a');
    dropdownItems.forEach(item => {
        const filter = item.dataset.filter;
        const i18nKey = item.dataset.i18n;

        if (i18nKey) {
            item.textContent = t(i18nKey);
        } else if (filter) {
            item.textContent = t(filter);
        }
    });

    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.placeholder = t('searchPlaceholder');
    }
}

export function updateNavActiveState(pageName) {
    document.querySelectorAll('.nav-links > li > a').forEach(link => {
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

export function updateProfileImage(photoUrl) {
    const profileImg = document.getElementById('nav-profile-img');
    if (profileImg) {
        profileImg.src = photoUrl;
    }
}
