'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

type Commerce = {
  id: number;
  name: string;
  address: string;
  phone: string;
  ssid: string;
  password: string;
  wifi_type: string;
  active: number;
  total_scans: number;
  total_consents: number;
};

export default function EditCommercePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [commerce, setCommerce] = useState<Commerce | null>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', ssid: '', password: '', wifi_type: 'WPA', active: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/commerces/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCommerce(data);
        setForm({ name: data.name, address: data.address || '', phone: data.phone || '', ssid: data.ssid, password: data.password, wifi_type: data.wifi_type || 'WPA', active: data.active });
      });
  }, [id]);

  function set(field: string, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const res = await fetch(`/api/commerces/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const data = await res.json();
      setError(data.error || 'Erreur lors de la sauvegarde');
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm(`Supprimer "${commerce?.name}" ? Cette action est irréversible.`)) return;
    setDeleting(true);
    await fetch(`/api/commerces/${id}`, { method: 'DELETE' });
    router.push('/admin');
  }

  if (!commerce) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Retour
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Modifier : {commerce.name}</h1>
      </header>

      <main className="max-w-lg mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-1">Scans totaux</p>
            <p className="text-2xl font-bold text-blue-600">{commerce.total_scans || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-1">Consentements</p>
            <p className="text-2xl font-bold text-green-600">{commerce.total_consents || 0}</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 mb-6">
          <Link
            href={`/admin/commerce/${id}/sticker`}
            className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-lg text-sm text-center transition-colors"
          >
            🖨️ Voir le sticker
          </Link>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom du commerce</label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse</label>
            <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
            <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <hr className="border-gray-100" />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">SSID WiFi</label>
            <input type="text" value={form.ssid} onChange={(e) => set('ssid', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe WiFi</label>
            <input type="text" value={form.password} onChange={(e) => set('password', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Type de sécurité</label>
            <select value={form.wifi_type} onChange={(e) => set('wifi_type', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="WPA">WPA / WPA2 / WPA3</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Ouvert</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={form.active === 1}
              onChange={(e) => set('active', e.target.checked ? 1 : 0)}
              className="w-4 h-4 accent-blue-600" />
            <label htmlFor="active" className="text-sm font-semibold text-gray-700">
              Commerce actif (la page WiFi est accessible)
            </label>
          </div>

          {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-2">✓ Sauvegardé avec succès</div>}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
            {loading ? 'Sauvegarde...' : '✓ Sauvegarder'}
          </button>
        </form>

        {/* Delete */}
        <div className="mt-6 bg-white rounded-xl border border-red-100 p-4">
          <h3 className="text-sm font-semibold text-red-700 mb-2">Zone de danger</h3>
          <button onClick={handleDelete} disabled={deleting}
            className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50">
            {deleting ? 'Suppression...' : '🗑️ Supprimer ce commerce'}
          </button>
        </div>
      </main>
    </div>
  );
}
