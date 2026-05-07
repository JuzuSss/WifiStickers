'use client';

import { QRCodeSVG } from 'qrcode.react';

type Props = {
  value: string;
  size?: number;
  className?: string;
};

export default function QRCode({ value, size = 200, className = '' }: Props) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      bgColor="#ffffff"
      fgColor="#1e3a8a"
      level="M"
      className={className}
    />
  );
}
