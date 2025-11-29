import { state } from './state.js';

export const translations = {
    en: {
        // Navbar
        movies: "Movies",
        series: "Series",
        lists: "Lists",
        profile: "Profile",
        searchPlaceholder: "Search movies, series...",

        // Common
        rate: "Rate",
        comment: "Comment",
        theme: "Theme",
        blueLight: "Blue Light Filter",
        shortcuts: "Shortcuts",
        addToWatchlist: "+ Add to Watchlist",
        inWatchlist: "✓ In Watchlist",
        director: "Director",
        cast: "Cast",
        availableOn: "Available on",
        directedBy: "Directed by",

        // Sort & Filter
        sortBy: "Sort by",
        latest: "Latest",
        oldest: "Oldest",
        ratingHighLow: "Rating (High-Low)",
        ratingLowHigh: "Rating (Low-High)",
        allGenres: "All Genres",
        allYears: "All Years",
        All: "All",

        // Movies & Series Pages
        moviesTitle: "Movies",
        seriesTitle: "Series",

        // Lists Page
        listsTitle: "Your Lists",
        myLists: "My Lists",
        createList: "Create New List",
        noLists: "You haven't created any lists yet.",
        createListModalTitle: "Create New List",
        listNamePlaceholder: "List Name",
        createBtn: "Create",
        cancelBtn: "Cancel",
        addItemsPlaceholder: "Search to add items...",
        itemsCount: "({count} items)",
        selectedItems: "Selected Items:",
        noItemsSelected: "No items selected",
        enterListName: "Please enter a list name",
        selectOneItem: "Please select at least one item",
        listCreated: "List \"{name}\" created!",

        // Profile Page
        profileTitle: "Your Profile",
        stats: "Stats",
        watched: "Watched",
        watchlist: "Watchlist",
        listsCount: "Lists",
        favoriteGenres: "Favorite Genres",
        editProfile: "Edit Profile",
        saveChanges: "Save Changes",
        nameLabel: "Name",
        lastNameLabel: "Last Name",
        bioLabel: "Bio",
        myMovies: "Rated Content",
        noRatedMovies: "You haven't rated any content yet.",
        memberSince: "Member since 2024",
        currentRank: "Current Rank",
        rankSystem: "Rank System",
        rankInfo: "{count} / {threshold} to {nextLevel}",
        rankMax: "Max Level",
        rankNext: "{count} more ratings to reach {nextLevel}",
        rankTop: "You have reached the top rank!",

        // Toast Messages
        addedToWatchlist: "Added {title} to watchlist",
        removedFromWatchlist: "Removed {title} from watchlist",
        restored: "Restored {title}",
        alreadyInWatchlist: "{title} is already in your watchlist",
        undo: "Undo",
        ratingSaved: "The movie rated and saved",
        view: "View",
        favoriteMovie: "Favorite Movie",
        favoriteSeries: "Favorite Series",
        addFavoriteMovie: "Add Favorite Movie",
        addFavoriteSeries: "Add Favorite Series",
        selectMovie: "Select Movie",
        selectSeries: "Select Series",
        change: "Change",
        remove: "Remove",
        favorites: "Favorites",
        name: "Name",

        // Gamification
        cinephile: "Cinephile",
        movieBuff: "Movie Buff",
        novice: "Novice",

        // Genres
        "Sci-Fi": "Sci-Fi",
        "Crime": "Crime",
        "Drama": "Drama",
        "Action": "Action",
        "Animation": "Animation",
        "Comedy": "Comedy",
        "Thriller": "Thriller"
    },
    tr: {
        // Navbar
        movies: "Filmler",
        series: "Diziler",
        lists: "Listeler",
        profile: "Profil",
        searchPlaceholder: "Film, dizi ara...",

        // Common
        rate: "Değerlendir",
        comment: "Yorumlarım",
        theme: "Tema",
        blueLight: "Mavi Işık Filtresi",
        shortcuts: "Kısayollar",
        addToWatchlist: "+ İzleme Listesine Ekle",
        inWatchlist: "✓ Listede",
        director: "Yönetmen",
        cast: "Oyuncular",
        availableOn: "Platform",
        directedBy: "Yönetmen",

        // Sort & Filter
        sortBy: "Sırala",
        latest: "En Yeni",
        oldest: "En Eski",
        ratingHighLow: "Puan (Yüksek-Düşük)",
        ratingLowHigh: "Puan (Düşük-Yüksek)",
        allGenres: "Tüm Türler",
        allYears: "Tüm Yıllar",
        All: "Hepsi",

        // Movies & Series Pages
        moviesTitle: "Filmler",
        seriesTitle: "Diziler",

        // Lists Page
        listsTitle: "Listelerin",
        myLists: "Listelerim",
        createList: "Yeni Liste Oluştur",
        noLists: "Henüz hiç liste oluşturmadın.",
        createListModalTitle: "Yeni Liste Oluştur",
        listNamePlaceholder: "Liste Adı",
        createBtn: "Oluştur",
        cancelBtn: "İptal",
        addItemsPlaceholder: "Eklemek için ara...",
        itemsCount: "({count} öğe)",
        selectedItems: "Seçilen Öğeler:",
        noItemsSelected: "Hiçbir öğe seçilmedi",
        enterListName: "Lütfen bir liste adı girin",
        selectOneItem: "Lütfen en az bir öğe seçin",
        listCreated: "\"{name}\" listesi oluşturuldu!",

        // Profile Page
        profileTitle: "Profilin",
        stats: "İstatistikler",
        watched: "İzlenenler",
        watchlist: "İzleme Listesi",
        listsCount: "Listeler",
        favoriteGenres: "Favori Türler",
        editProfile: "Profili Düzenle",
        saveChanges: "Değişiklikleri Kaydet",
        nameLabel: "İsim",
        lastNameLabel: "Soyisim",
        bioLabel: "Biyografi",
        myMovies: "Değerlendirilen İçerikler",
        noRatedMovies: "Henüz hiç içerik puanlamadın.",
        memberSince: "2024'ten beri üye",
        currentRank: "Mevcut Rütbe",
        rankSystem: "Rütbe Sistemi",
        rankInfo: "{nextLevel} için {count} / {threshold}",
        rankMax: "Maksimum Seviye",
        rankNext: "<strong>{nextLevel}</strong> rütbesine ulaşmak için {count} puanlama daha yap",
        rankTop: "En üst rütbeye ulaştın!",

        // Toast Messages
        addedToWatchlist: "{title} listeye eklendi",
        removedFromWatchlist: "{title} listeden çıkarıldı",
        restored: "{title} geri yüklendi",
        alreadyInWatchlist: "{title} zaten listende",
        undo: "Geri Al",
        ratingSaved: "Film puanlandı ve kaydedildi",
        view: "Görüntüle",
        favoriteMovie: "Favori Film",
        favoriteSeries: "Favori Dizi",
        addFavoriteMovie: "Favori Film Ekle",
        addFavoriteSeries: "Favori Dizi Ekle",
        selectMovie: "Film Seç",
        selectSeries: "Dizi Seç",
        change: "Değiştir",
        remove: "Kaldır",
        favorites: "Favoriler",
        name: "İsim",

        // Gamification
        cinephile: "Sinefil",
        movieBuff: "Film Kurdu",
        novice: "Çaylak",

        // Genres
        "Sci-Fi": "Bilim Kurgu",
        "Crime": "Suç",
        "Drama": "Dram",
        "Action": "Aksiyon",
        "Animation": "Animasyon",
        "Comedy": "Komedi",
        "Thriller": "Gerilim"
    }
};

export function t(key, params = {}) {
    const lang = state.language || 'en';
    let text = translations[lang][key] || key;

    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });

    return text;
}
