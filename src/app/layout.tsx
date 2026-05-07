import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WifiStickers – WiFi gratuit pour votre commerce',
  description: 'Connectez vos clients au WiFi avec un simple QR code.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
