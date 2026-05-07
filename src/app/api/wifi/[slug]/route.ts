import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const db = getDb();
  const commerce = db
    .prepare('SELECT id, name, address, ssid, password, wifi_type, active FROM commerces WHERE slug = ?')
    .get(params.slug);

  if (!commerce) {
    return NextResponse.json({ error: 'Commerce introuvable' }, { status: 404 });
  }
  return NextResponse.json(commerce);
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  const db = getDb();
  const commerce = db
    .prepare('SELECT id FROM commerces WHERE slug = ?')
    .get(params.slug) as { id: number } | undefined;

  if (!commerce) {
    return NextResponse.json({ error: 'Commerce introuvable' }, { status: 404 });
  }

  const { consented } = await request.json();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '';

  db.prepare('INSERT INTO scans (commerce_id, consented, ip) VALUES (?, ?, ?)')
    .run(commerce.id, consented ? 1 : 0, ip);

  return NextResponse.json({ ok: true });
}
