# Add More Movies and Series

I will add 10 new items (5 movies, 5 series) to the database, complete with generated poster images.

## User Review Required
> [!NOTE]
> I will be generating images for these movies/series. They might not look exactly like the official posters but will be representative.

## Proposed Changes

### Data
#### [MODIFY] [movies.js](file:///d:/DALTONLAR/src/data/movies.js)
- Add 5 new movies:
    - The Matrix (Sci-Fi)
    - Gladiator (Action)
    - The Shawshank Redemption (Drama)
    - Spider-Man: Into the Spider-Verse (Animation)
    - Se7en (Crime)
- Add 5 new series:
    - The Mandalorian (Sci-Fi)
    - Sherlock (Crime)
    - The Queen's Gambit (Drama)
    - Arcane (Animation)
    - Mindhunter (Crime)

### Assets
- Generate and save 10 images to `public/images/`.

### UI
#### [MODIFY] [index.html](file:///d:/DALTONLAR/index.html)
- Add "Animation" to Series dropdown filter to accommodate "Arcane".

## Verification Plan

### Automated Tests
- None available.

### Manual Verification
1.  Open the application in the browser.
2.  Verify that new movies appear in the "Movies" section.
3.  Verify that new series appear in the "Series" section.
4.  Check that images load correctly.
5.  Test filtering:
    - Select "Animation" under Series and check if "Arcane" appears.
    - Check other filters for new items.
