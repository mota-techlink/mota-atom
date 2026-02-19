// src/app/opengraph-image.tsx
// 动态生成 OG 图片 (需要 edge runtime)
import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Logo Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 700,
              color: 'white',
            }}
          >
            M
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '900px',
          }}
        >
          {siteConfig.name}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '24px',
            color: '#94a3b8',
            textAlign: 'center',
            marginTop: '16px',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          {siteConfig.description}
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: '18px',
            color: '#64748b',
            marginTop: '40px',
          }}
        >
          {siteConfig.url.replace('https://', '')}
        </div>
      </div>
    ),
    { ...size }
  );
}
