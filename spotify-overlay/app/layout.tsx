import "./globals.css";

export const metadata = {
  title: "Twitch Overlay",
  description: "Spotify Now Playing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
