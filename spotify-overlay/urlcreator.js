require("dotenv").config({path: ".env.local"});

const clientId = process.env.SPOTIFY_CLIENT_ID;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
const scopes = [
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-modify-playback-state",
];

const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${encodeURIComponent(
  clientId
)}&scope=${encodeURIComponent(scopes.join(" "))}&redirect_uri=${encodeURIComponent(
  redirectUri
)}`;

console.log("Open this URL in your browser:\n", authUrl);
