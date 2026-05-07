import Link from 'next/link';
import { getDb } from '@/lib/db';
import LogoutButton from './LogoutButton';

type CommerceRow = {
  id: number;
  name: string;
  slug: string;
  address: string;
  ssid: string;
  active: number;
  created_at: string;
  total_scans: number;
  total_consents: number;
};

function getStats() {
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
    .all() as CommerceRow[];

  const totalScans = commerces.reduce((a, c) => a + (c.total_scans || 0), 0);
  const totalConsents = commerces.reduce((a, c) => a + (c.total_consents || 0), 0);

  return { commerces, totalScans, totalConsents };
}

export default function AdminDashboard() {
  const { commerces, totalScans, totalConsents } = getStats();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📶</span>
          <h1 className="text-xl font-bold text-gray-900">WifiStickers Admin</h1>
        </div>
        <LogoutButton />
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Commerces partenaires</p>
            <p className="text-3xl font-bold text-blue-600">{commerces.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total scans</p>
            <p className="text-3xl font-bold text-blue-600">{totalScans}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Consentements donnés</p>
            <p className="text-3xl font-bold text-green-600">{totalConsents}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Commerces partenaires</h2>
          <Link
            href="/admin/commerce/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            + Ajouter un commerce
          </Link>
        </div>

        {/* Table */}
        {commerces.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">Aucun commerce pour l'instant</p>
            <Link
              href="/admin/commerce/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Ajouter votre premier commerce
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Commerce</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">SSID WiFi</th>
                  <th className="text-center px-4 py-3 text-gray-600 font-semibold">Scans</th>
                  <th className="text-center px-4 py-3 text-gray-600 font-semibold">Consentements</th>
                  <th className="text-center px-4 py-3 text-gray-600 font-semibold">Statut</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {commerces.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{c.name}</p>
                      <p className="text-gray-400 text-xs">{c.address || '—'}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-700">{c.ssid}</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600">
                      {c.total_scans || 0}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-green-600">
                      {c.total_consents || 0}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          c.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {c.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`${baseUrl}/wifi/${c.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 text-xs"
                          title="Voir la page client"
                        >
                          Voir
                        </a>
                        <Link
                          href={`/admin/commerce/${c.id}/sticker`}
                          className="text-gray-400 hover:text-blue-600 text-xs"
                        >
                          Sticker
                        </Link>
                        <Link
                          href={`/admin/commerce/${c.id}`}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Modifier
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
