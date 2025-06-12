export default function handler(req, res) {
  res.status(200).json({
    isPlaying: true,
    name: "Test Song",
    artist: "Test Artist",
    albumArt: "https://via.placeholder.com/64"
  });
}
