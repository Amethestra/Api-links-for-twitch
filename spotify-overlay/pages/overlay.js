// /pages/overlay.js
export default function Overlay() {
  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          background: transparent;
          font-family: 'Segoe UI', sans-serif;
        }
      `}</style>
      <style jsx>{`
        .song-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          width: 320px;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
        }

        .album-cover {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          object-fit: cover;
        }

        .song-info {
          overflow: hidden;
        }

        .song-name {
          font-weight: 600;
          font-size: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .artist-name {
          font-size: 0.875rem;
          opacity: 0.8;
        }
      `}</style>

      <div className="song-card" id="song-card">
        <img className="album-cover" id="album" src="" alt="Album Cover" />
        <div className="song-info">
          <div className="song-name" id="track">Loading...</div>
          <div className="artist-name" id="artist"></div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
        async function updateSong() {
          try {
            const res = await fetch('/api/song');
            const data = await res.json();

            const track = document.getElementById('track');
            const artist = document.getElementById('artist');
            const album = document.getElementById('album');

            if (data.isPlaying) {
              track.textContent = data.name;
              artist.textContent = data.artist;
              album.src = data.albumArt;
            } else {
              track.textContent = 'Nothing playing';
              artist.textContent = '';
              album.src = '/fallback.png';
            }
          } catch (e) {
            console.error('Error fetching song:', e);
          }
        }

        updateSong();
        setInterval(updateSong, 5000);
        `
      }} />
    </>
  );
}
