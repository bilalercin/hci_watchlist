// Centralized State Management
export const state = {
    watchlist: [],
    myMovies: [], // Stores rated/commented items
    lastRemoved: null,
    currentPage: 'movies',
    filter: {
        genre: 'All',
        type: 'movies' // 'movies' or 'series'
    },
    userProfile: {
        firstName: 'User',
        lastName: '',
        photo: 'https://ui-avatars.com/api/?name=User&background=random'
    },
    customLists: [], // User created lists
    isEditingProfile: false
};

// State update functions
export function createList(name, items) {
    const newList = {
        id: Date.now(), // Simple ID
        name: name,
        items: items,
        createdAt: new Date().toISOString()
    };
    state.customLists.push(newList);
    return newList;
}
export function addToWatchlist(item) {
    if (state.watchlist.find(i => i.id === item.id)) {
        return false; // Already exists
    }
    state.watchlist.push(item);
    return true;
}

export function removeFromWatchlist(itemId) {
    const index = state.watchlist.findIndex(i => i.id === itemId);
    if (index > -1) {
        const item = state.watchlist[index];
        state.watchlist.splice(index, 1);
        state.lastRemoved = { item, index };
        return item;
    }
    return null;
}

export function undoRemove() {
    if (state.lastRemoved) {
        const { item, index } = state.lastRemoved;
        state.watchlist.splice(index, 0, item);
        state.lastRemoved = null;
        return item;
    }
    return null;
}

export function addOrUpdateRating(item, rating, comment) {
    const myMovieItem = {
        ...item,
        userRating: rating,
        userComment: comment,
        type: item.id > 100 ? 'series' : 'movie'
    };

    const idx = state.myMovies.findIndex(i => i.id === item.id);
    if (idx > -1) {
        state.myMovies[idx] = myMovieItem;
    } else {
        state.myMovies.push(myMovieItem);
    }
    return myMovieItem;
}

export function updateUserProfile(firstName, lastName, photo) {
    state.userProfile = { firstName, lastName, photo };
}

export function setCurrentPage(page) {
    state.currentPage = page;
}

export function setFilter(genre, type) {
    state.filter.genre = genre;
    state.filter.type = type;
}

export function setEditingProfile(isEditing) {
    state.isEditingProfile = isEditing;
}
