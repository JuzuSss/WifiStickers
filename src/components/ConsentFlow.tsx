'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

const QRCode = dynamic(() => import('./QRCode'), { ssr: false });

type Commerce = {
  id: number;
  name: string;
  address: string;
  ssid: string;
  password: string;
  wifi_type: string;
};

type Stage = 'consent' | 'ad' | 'wifi' | 'declined';

const AD_DURATION = 5;

export default function ConsentFlow({ commerce, slug }: { commerce: Commerce; slug: string }) {
  const [stage, setStage] = useState<Stage>('consent');
  const [countdown, setCountdown] = useState(AD_DURATION);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const recordScan = useCallback(
    async (consented: boolean) => {
      await fetch(`/api/wifi/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consented }),
      });
    },
    [slug]
  );

  const handleAccept = useCallback(async () => {
    await recordScan(true);
    setStage('ad');
  }, [recordScan]);

  const handleDecline = useCallback(async () => {
    await recordScan(false);
    setStage('declined');
  }, [recordScan]);

  useEffect(() => {
    if (stage !== 'ad') return;
    if (countdown <= 0) {
      setStage('wifi');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [stage, countdown]);

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(commerce.password);
    } else {
      const el = document.createElement('textarea');
      el.value = commerce.password;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ── Écran consentement ──────────────────────────────────────────────────────
  if (stage === 'consent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
          <div className="text-5xl mb-4">📶</div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">WiFi gratuit</h1>
          <p className="text-blue-600 font-semibold mb-4">{commerce.name}</p>

          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 text-sm text-gray-600">
            <p className="font-semibold text-gray-800 mb-2">Avant de continuer :</p>
            <p>
              Pour accéder au WiFi gratuit, vous acceptez de voir une courte publicité (5 secondes).
              Vos données de connexion ne sont pas partagées à des tiers.
            </p>
            <a href="/mentions-legales" className="text-blue-500 underline text-xs mt-2 block">
              Politique de confidentialité &amp; mentions légales
            </a>
          </div>

          <button
            onClick={handleAccept}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl mb-3 transition-colors"
          >
            ✓ Accepter et continuer
          </button>
          <button
            onClick={handleDecline}
            className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors"
          >
            Non merci, refuser
          </button>
        </div>
      </div>
    );
  }

  // ── Refus ───────────────────────────────────────────────────────────────────
  if (stage === 'declined') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-6">
            Sans accepter nos conditions, vous ne pouvez pas vous connecter au WiFi.
          </p>
          <button
            onClick={() => setStage('consent')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  // ── Publicité ───────────────────────────────────────────────────────────────
  if (stage === 'ad') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
          <div className="bg-gray-100 flex items-center justify-center min-h-[260px] relative">
            <div className="text-center text-gray-400 select-none">
              <div className="text-4xl mb-2">📣</div>
              <p className="text-sm font-medium">Espace publicitaire</p>
              <p className="text-xs">(Publicité de votre partenaire local)</p>
            </div>
            <div className="absolute top-3 right-3 bg-black/60 text-white text-sm font-bold px-3 py-1 rounded-full">
              {countdown}s
            </div>
          </div>

          <div className="p-4 text-center">
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${((AD_DURATION - countdown) / AD_DURATION) * 100}%` }}
              />
            </div>
            <p className="text-gray-500 text-sm">
              Accès WiFi dans{' '}
              <span className="font-bold text-blue-600">
                {countdown} seconde{countdown > 1 ? 's' : ''}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Identifiants WiFi ───────────────────────────────────────────────────────
  const wifiQrValue = `WIFI:T:${commerce.wifi_type};S:${commerce.ssid};P:${commerce.password};;`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">✅</div>
          <h2 className="text-xl font-bold text-gray-900">Connectez-vous !</h2>
          <p className="text-gray-500 text-sm">{commerce.name}</p>
        </div>

        {/* QR WiFi auto-connexion — méthode principale */}
        <div className="bg-blue-50 rounded-2xl p-4 mb-4 text-center">
          <p className="text-xs font-semibold text-blue-700 uppercase mb-3">
            Connexion automatique
          </p>
          <div className="flex justify-center mb-3">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <QRCode value={wifiQrValue} size={180} />
            </div>
          </div>
          <p className="text-xs text-blue-600 font-medium">
            📷 Pointez votre appareil photo sur ce QR code
          </p>
          <p className="text-xs text-blue-500 mt-0.5">
            Un popup "Rejoindre le réseau" va apparaître
          </p>
        </div>

        {/* Séparateur */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">ou manuellement</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Réseau + mot de passe — fallback */}
        <div className="bg-gray-50 rounded-xl p-4 mb-3">
          <div className="mb-3">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Réseau</p>
            <p className="font-bold text-gray-900 text-lg">{commerce.ssid}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Mot de passe</p>
            <div className="flex items-center gap-2">
              <p className="font-mono font-bold text-gray-900 text-lg flex-1 break-all">
                {showPassword ? commerce.password : '•'.repeat(Math.min(commerce.password.length, 16))}
              </p>
              <button
                onClick={() => setShowPassword((v) => !v)}
                className="text-blue-500 text-sm hover:text-blue-700 shrink-0"
              >
                {showPassword ? 'Masquer' : 'Voir'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="w-full bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 font-semibold py-2.5 px-6 rounded-xl transition-all text-sm"
        >
          {copied ? '✓ Copié !' : '📋 Copier le mot de passe'}
        </button>
      </div>
    </div>
  );
}
