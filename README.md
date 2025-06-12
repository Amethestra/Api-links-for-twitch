# Project Overview

This project provides a backend service and frontend overlay designed to integrate with Spotify's API to display currently playing song information in a transparent OBS overlay.

## Backend functionality

- ### Spotify Authentication & Token Management:
    Handles OAuth2 with Spotify to obtain and refresh access tokens securely using stored refresh tokens.

- ### API Route:
    This API endpoint fetches the currently playing track from the Spotify Web API. It returns JSON data containing
    - isPlaying: A boolean indicating if a song is playing
    - name: Track name
    - artist: Artist(s) name
    - albumArt: URL to the album cover image

    If no song is playing or an error occurs, it return an appropriate JSON response with an error message or empty data.

- ### Error Handling:

    Handles Spotify API errors; including token refresh failures and other unexpected errors

## Frontend Functionality

- ### Overlay Page:

    A React component that fetches /api/song every few seconds to update the display of the current song

    It shows:
    - Album cover
    - Song title
    - Artist names


