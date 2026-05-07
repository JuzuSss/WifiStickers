import { notFound } from 'next/navigation';
import ConsentFlow from '@/components/ConsentFlow';

type Props = { params: { slug: string } };

async function getCommerce(slug: string) {
  // Dynamic import to avoid bundling better-sqlite3 in client
  const { getDb } = await import('@/lib/db');
  const db = getDb();
  return db
    .prepare('SELECT id, name, address, ssid, password, wifi_type, active FROM commerces WHERE slug = ?')
    .get(slug) as
    | { id: number; name: string; address: string; ssid: string; password: string; wifi_type: string; active: number }
    | undefined;
}

export default async function WifiPage({ params }: Props) {
  const commerce = await getCommerce(params.slug);

  if (!commerce || !commerce.active) {
    notFound();
  }

  return <ConsentFlow commerce={commerce} slug={params.slug} />;
}

export async function generateMetadata({ params }: Props) {
  const commerce = await getCommerce(params.slug);
  return {
    title: commerce ? `WiFi – ${commerce.name}` : 'WiFi',
  };
}
