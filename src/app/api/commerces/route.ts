import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  const db = getDb();
  const commerces = db
    .prepare(`
      SELECT c.*,
        COUNT(DISTINCT s.id) as total_scans,
        SUM(CASE WHEN s.consented = 1 THEN 1 ELSE 0 END) as total_consents
      FROM commerces c
      LEFT JOIN scans s ON s.commerce_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `)
    .all();
  return NextResponse.json(commerces);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();
  const { name, address, phone, ssid, password, wifi_type } = body;

  if (!name || !ssid || !password) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  let slug = slugify(name);
  // Ensure slug uniqueness
  const existing = db.prepare('SELECT id FROM commerces WHERE slug = ?').get(slug);
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const result = db
    .prepare(
      `INSERT INTO commerces (name, slug, address, phone, ssid, password, wifi_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(name, slug, address || '', phone || '', ssid, password, wifi_type || 'WPA');

  const commerce = db.prepare('SELECT * FROM commerces WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json(commerce, { status: 201 });
}
