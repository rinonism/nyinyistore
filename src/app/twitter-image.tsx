import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'NyinyiStore - Top Up Game Termurah & Tercepat';
export const size = { width: 1200, height: 600 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 50%, #121212 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Fredoka", sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://nyinyistore.com/logo-cat.png"
            alt="NyinyiStore"
            width="80"
            height="80"
            style={{ borderRadius: '16px' }}
          />
          <div style={{ fontSize: '52px', fontWeight: 'bold', color: '#EF8F8F', fontFamily: '"Fredoka", sans-serif' }}>NyinyiStore</div>
        </div>
        <div style={{ fontSize: '28px', color: '#d4af37', fontWeight: 'bold', marginBottom: '20px' }}>
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
