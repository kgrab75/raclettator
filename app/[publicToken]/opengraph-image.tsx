import { fetchEventByPublicToken } from '@/lib/event/data';
import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og';

const brand = process.env.NEXT_PUBLIC_BRAND;

export const alt = brand;
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ publicToken: string }> }) {
    const { publicToken } = await params;
    const event = await fetchEventByPublicToken(publicToken);    
    
    if (!event) return new Response('Not Found', { status: 404 });

    const t = await getTranslations('OG');
    const tStartsAt = await getTranslations('NewEvent.form.startsAt');
    
    const d = new Date(event.startsAt);
    const dateFormatted = tStartsAt('previewFromDate', { 
        day: d.getDate(), 
        startsAtDate: d 
    });

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    backgroundImage: 'linear-gradient(to bottom right, #f59e0b, #ea580c)',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Decorative background circle */}
                <div
                    style={{
                        position: 'absolute',
                        top: -150,
                        right: -150,
                        width: 500,
                        height: 500,
                        borderRadius: 250,
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    }}
                />

                {/* Top header/logo */}
                <div
                    style={{
                        position: 'absolute',
                        top: 48,
                        left: 48,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        color: 'white',
                    }}
                >
                    <span style={{ fontSize: 32, fontWeight: 'bold', letterSpacing: '-0.02em' }}>
                        {brand}
                    </span>
                    <span style={{ fontSize: 32 }}>🧀</span>
                </div>

                {/* Main Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '0 80px',
                    }}
                >
                    <h1
                        style={{
                            fontSize: 92,
                            fontWeight: 900,
                            color: 'white',
                            marginBottom: 24,
                            lineHeight: 1.1,
                            letterSpacing: '-0.04em',
                            textShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                    >
                        {event.title}
                    </h1>

                    <div
                        style={{
                            display: 'flex',
                            gap: 32,
                            alignItems: 'center',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: 32,
                            fontWeight: 500,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>{dateFormatted}</span>
                        </div>
                        <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.4)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>

                {/* Catchy footer */}
                <div
                    style={{
                        marginTop: 64,
                        padding: '18px 42px',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: 100,
                        border: '1.5px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        fontSize: 42,
                        fontWeight: 'bold',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    }}
                >
                    {t('catchphrase')}
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}