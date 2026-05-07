import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const commerce = db
    .prepare(`
      SELECT c.*,
        COUNT(DISTINCT s.id) as total_scans,
        SUM(CASE WHEN s.consented = 1 THEN 1 ELSE 0 END) as total_consents
      FROM commerces c
      LEFT JOIN scans s ON s.commerce_id = c.id
      WHERE c.id = ?
      GROUP BY c.id
    `)
    .get(Number(params.id));

  if (!commerce) {
    return NextResponse.json({ error: 'Commerce introuvable' }, { status: 404 });
  }
  return NextResponse.json(commerce);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const body = await request.json();
  const { name, address, phone, ssid, password, wifi_type, active } = body;

  db.prepare(`
    UPDATE commerces
    SET name = ?, address = ?, phone = ?, ssid = ?, password = ?, wifi_type = ?, active = ?
    WHERE id = ?
  `).run(name, address || '', phone || '', ssid, password, wifi_type || 'WPA', active ?? 1, Number(params.id));

  const commerce = db.prepare('SELECT * FROM commerces WHERE id = ?').get(Number(params.id));
  return NextResponse.json(commerce);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  db.prepare('DELETE FROM commerces WHERE id = ?').run(Number(params.id));
  return NextResponse.json({ ok: true });
}
