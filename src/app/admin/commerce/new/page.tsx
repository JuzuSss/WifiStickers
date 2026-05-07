'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCommercePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    ssid: '',
    password: '',
    wifi_type: 'WPA',
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/commerces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const commerce = await res.json();
      router.push(`/admin/commerce/${commerce.id}/sticker`);
    } else {
      const data = await res.json();
      setError(data.error || 'Erreur lors de la création');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Retour
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Nouveau commerce</h1>
      </header>

      <main className="max-w-lg mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nom du commerce <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Ex: Le Café de la Paix"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Ex: 12 rue de la Paix, 75001 Paris"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Ex: 01 23 45 67 89"
            />
          </div>

          <hr className="border-gray-100" />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nom du réseau WiFi (SSID) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.ssid}
              onChange={(e) => set('ssid', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              placeholder="Ex: CaféWifi_Public"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mot de passe WiFi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              placeholder="Ex: MotDePasse123"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Type de sécurité WiFi
            </label>
            <select
              value={form.wifi_type}
              onChange={(e) => set('wifi_type', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="WPA">WPA / WPA2 / WPA3 (recommandé)</option>
              <option value="WEP">WEP (ancien)</option>
              <option value="nopass">Ouvert (sans mot de passe)</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Création...' : '✓ Créer le commerce et générer le sticker'}
          </button>
        </form>
      </main>
    </div>
  );
}
