import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'NyinyiStore - Top Up Game Termurah & Tercepat';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 50%, #121212 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ fontSize: '64px' }}>🎮</div>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#EF8F8F' }}>NyinyiStore</div>
        </div>
        <div style={{ fontSize: '28px', color: '#d4af37', fontWeight: 'bold', marginBottom: '16px' }}>
          Top Up Game Termurah & Tercepat
        </div>
        <div style={{ fontSize: '18px', color: '#999', display: 'flex', gap: '24px' }}>
          <span>⚡ Proses Instan</span>
          <span>🔒 Aman</span>
          <span>🪙 Bayar Crypto</span>
          <span>💰 Harga Murah</span>
        </div>
        <div style={{ position: 'absolute', bottom: '40px', fontSize: '16px', color: '#555' }}>
          nyinyistore.com
        </div>
      </div>
    ),
    { ...size }
  );
}
