import "./globals.css";

export const metadata = {
  title: "Twitch Overlays",
  description: "A Collection of overlays and Modules for the Streamer Amethestra",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", margin: 0 }}>{children}</body>
    </html>
  );
}
