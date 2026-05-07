'use client';

import Link from 'next/link';
import StickerDesign from '@/components/StickerDesign';

type Props = {
  commerce: { id: number; name: string; slug: string; address: string; ssid: string };
  wifiPageUrl: string;
};

export default function StickerClient({ commerce, wifiPageUrl }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Controls - hidden on print */}
      <div className="no-print bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/admin/commerce/${commerce.id}`} className="text-gray-400 hover:text-gray-600 text-sm">
            ← Retour
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Sticker – {commerce.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400 hidden md:block">
            Taille : 10cm × 10cm · Compatible imprimante d'étiquettes et laser
          </p>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
          >
            🖨️ Imprimer le sticker
          </button>
        </div>
      </div>

      {/* Info bar - hidden on print */}
      <div className="no-print max-w-2xl mx-auto px-6 py-4">
        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 flex gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-semibold mb-1">Comment utiliser ce sticker ?</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Cliquez sur "Imprimer le sticker"</li>
              <li>Sélectionnez votre imprimante (laser ou étiquettes)</li>
              <li>Imprimez en taille réelle (100%, sans mise à l'échelle)</li>
              <li>Collez le sticker à un endroit visible dans le commerce</li>
            </ol>
            <p className="mt-2 text-xs text-blue-600">
              URL de la page client :{' '}
              <a href={wifiPageUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {wifiPageUrl}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Sticker preview */}
      <div className="flex justify-center px-6 pb-12">
        <div className="bg-white shadow-lg rounded-2xl p-8 no-print">
          <StickerDesign
            commerceName={commerce.name}
            qrUrl={wifiPageUrl}
            ssid={commerce.ssid}
          />
        </div>
        {/* Print-only version without the card wrapper */}
        <div className="hidden print:flex print:items-center print:justify-center print:w-full print:h-full">
          <StickerDesign
            commerceName={commerce.name}
            qrUrl={wifiPageUrl}
            ssid={commerce.ssid}
          />
        </div>
      </div>
    </div>
  );
}
