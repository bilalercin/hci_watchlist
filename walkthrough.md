# Walkthrough - New Content Addition

I have added 10 new items to the database (5 movies, 5 series) and generated custom poster images for most of them.

## Changes

### Data
- Added 5 Movies:
  - The Matrix
  - Gladiator
  - The Shawshank Redemption
  - Spider-Man: Into the Spider-Verse
  - Se7en
- Added 5 Series:
  - The Mandalorian
  - Sherlock
  - The Queen's Gambit
  - Arcane (Placeholder image due to rate limit)
  - Mindhunter (Placeholder image due to rate limit)

### Assets
- Generated and saved 8 new poster images in `/public/images/`.

### UI
- Added "Animation" filter to the Series dropdown.

## Verification Steps

1.  **Check Movies**:
    - Go to the "Movies" page.
    - Verify that the new movies appear with their generated posters.
2.  **Check Series**:
    - Go to the "Series" page.
    - Verify that the new series appear.
    - Note that *Arcane* and *Mindhunter* will have placeholder images.
3.  **Check Filters**:
    - Hover over "Series" in the navbar.
    - Click "Animation".
    - Verify that *Arcane* appears (along with *Spider-Man* if it was a series, but it's a movie, so check *Arcane*).
    - Wait, *Spider-Man* is a movie, so it won't show under Series > Animation. *Arcane* is the only Animation series added.
