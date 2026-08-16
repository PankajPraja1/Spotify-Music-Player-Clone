# Spotify Music Player Clone

A responsive Spotify-inspired web music player built with vanilla HTML, CSS, and JavaScript.
This project recreates core web player interactions such as playlist browsing, dynamic track loading, play/pause controls, seek, previous/next navigation, and volume/mute handling.

## Why this project

This project demonstrates front-end fundamentals with real product-style behavior:

- DOM-driven UI rendering from JSON metadata and folder content
- Media playback control using the JavaScript Audio API
- Responsive layout and interaction design for desktop and mobile
- Modular static project structure using reusable assets and utility styles

## Key Features

- Dynamic playlist cards generated from `songs/*/info.json`
- Dynamic song list rendering for selected playlists
- Play, pause, previous, and next track controls
- Seekbar with clickable position updates
- Real-time current time and duration formatting
- Volume slider plus mute/unmute toggle
- Sidebar open/close behavior for smaller screens
- Responsive UI with custom Spotify Mix font integration

## Tech Stack

- HTML5
- CSS3 (custom styling + media queries)
- JavaScript (ES6+, Fetch API, Audio API)

## Project Structure

```text
.
|-- index.html
|-- css/
|   |-- style.css
|   |-- utility.css
|   `-- Spotify Mix UI Fonts/
|-- js/
|   `-- script.js
|-- imgs/
`-- songs/
	|-- <playlist-folder>/
	|   |-- cover.jpg
	|   `-- info.json
	`-- ...
```

## How to Run Locally

Because this app fetches playlist folders and metadata, run it through a local server (not by opening `index.html` directly).

1. Clone the repository.
2. Open the project folder.
3. Start a local server from the root folder, for example:

```bash
python -m http.server 5500
```

4. Open `http://localhost:5500` in your browser.

## Resume Highlights

- Built an interactive, Spotify-inspired music player using vanilla web technologies.
- Implemented dynamic content loading and playlist-driven UI updates.
- Developed custom media controls with progress tracking and volume state management.
- Created a responsive layout with mobile navigation behavior and reusable CSS utilities.

## Learning Outcomes

- Practical use of asynchronous JavaScript with `fetch()`
- Handling media playback events (`timeupdate`, play/pause state)
- Translating a known product UI into a functional front-end clone
- Structuring front-end projects for scalability and clarity

## Disclaimer

This project is a personal educational clone built for learning purposes.
Spotify trademarks, branding, and media rights belong to their respective owners.