// Navbar Component
import { state, setCurrentPage, setFilter } from '../utils/state.js';

export function initializeNavbar(renderPageCallback) {
    // Global Click Listener for Navigation (Delegation)
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a'); // Handle clicks on elements inside <a> (like img)

        if (!target) return;

        // Check if it's a nav link or profile link
        if (target.closest('.nav-links') || target.closest('.profile-container')) {
            e.preventDefault();
            const page = target.dataset.page;
            const filter = target.dataset.filter;
            const type = target.dataset.type;

            if (filter && type) {
                // Handle Dropdown Filter Click
                setFilter(filter, type);
                renderPageCallback(type); // 'movies' or 'series'
            } else if (page) {
                // Handle Page Link
                setFilter('All', state.filter.type); // Reset filter when switching main pages
                renderPageCallback(page);
            }
        }
    });

    // Update Nav Active State
    updateNavActiveState(state.currentPage);
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
