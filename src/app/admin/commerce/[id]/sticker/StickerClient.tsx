'use client';

import Link from 'next/link';
import StickerDesign from '@/components/StickerDesign';

type Props = {
  commerce: { id: number; name: string; slug: string; address: string; ssid: string };
  wifiPageUrl: string;
};

export default function StickerClient({ commerce, wifiPageUrl }: Props) {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; }
          @page { size: 10cm 10cm; margin: 0; }
          #sticker-print-wrap {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>

      {/* Everything below is hidden on print via .no-print */}
      <div className="no-print bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/admin/commerce/${commerce.id}`} className="text-gray-400 hover:text-gray-600 text-sm">
            ← Retour
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Sticker – {commerce.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400 hidden md:block">
            10cm × 10cm · laser ou étiquettes
          </p>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
          >
            🖨️ Imprimer le sticker
          </button>
        </div>
      </div>

      <div className="no-print max-w-2xl mx-auto px-6 py-4">
        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 flex gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-semibold mb-1">Comment utiliser ce sticker ?</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Cliquez sur "Imprimer le sticker"</li>
              <li>Sélectionnez votre imprimante (laser ou étiquettes)</li>
              <li>Imprimez en taille réelle (100 %, sans mise à l'échelle)</li>
              <li>Collez le sticker à un endroit visible dans le commerce</li>
            </ol>
            <p className="mt-2 text-xs text-blue-600">
              URL client :{' '}
              <a href={wifiPageUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {wifiPageUrl}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="no-print flex justify-center px-6 pb-6">
        <p className="text-xs text-gray-400">Aperçu du sticker (taille réelle en impression) :</p>
      </div>

      {/* Sticker – visible en aperçu ET en impression */}
      <div
        id="sticker-print-wrap"
        className="flex justify-center px-6 pb-12"
      >
        <StickerDesign
          commerceName={commerce.name}
          qrUrl={wifiPageUrl}
          ssid={commerce.ssid}
        />
      </div>
    </>
  );
}
