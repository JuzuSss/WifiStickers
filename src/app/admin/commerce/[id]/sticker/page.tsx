import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import StickerClient from './StickerClient';

type Props = { params: { id: string } };

export default function StickerPage({ params }: Props) {
  const db = getDb();
  const commerce = db
    .prepare('SELECT * FROM commerces WHERE id = ?')
    .get(Number(params.id)) as {
    id: number;
    name: string;
    slug: string;
    address: string;
    ssid: string;
  } | undefined;

  if (!commerce) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const wifiPageUrl = `${baseUrl}/wifi/${commerce.slug}`;

  return <StickerClient commerce={commerce} wifiPageUrl={wifiPageUrl} />;
}
