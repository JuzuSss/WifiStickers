'use client';

import dynamic from 'next/dynamic';

const QRCode = dynamic(() => import('./QRCode'), { ssr: false });

type Props = {
  commerceName: string;
  qrUrl: string;
  ssid: string;
};

export default function StickerDesign({ commerceName, qrUrl, ssid }: Props) {
  return (
    <div
      className="sticker-container"
      style={{
        width: '10cm',
        height: '10cm',
        background: '#ffffff',
        border: '2px solid #1e3a8a',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5cm',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: '22px', fontWeight: 900, color: '#1e3a8a', letterSpacing: '-0.5px' }}>
          📶 WiFi Gratuit
        </div>
        <div
          style={{
            fontSize: '13px',
            color: '#6b7280',
            marginTop: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {commerceName}
        </div>
      </div>

      {/* QR Code */}
      <div
        style={{
          background: '#eff6ff',
          borderRadius: '12px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <QRCode value={qrUrl} size={190} />
      </div>

      {/* Instructions */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <p
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#1e3a8a',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Scannez pour vous connecter
        </p>
        <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0' }}>
          Réseau : <strong>{ssid}</strong>
        </p>
        <p style={{ fontSize: '9px', color: '#9ca3af', margin: '3px 0 0' }}>
          wifistickers.fr
        </p>
      </div>
    </div>
  );
}
