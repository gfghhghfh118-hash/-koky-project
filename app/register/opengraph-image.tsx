
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Koky.bz - Earn Money Online'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
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
                    background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
                    color: 'white',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: 20,
                        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 48,
                        fontWeight: 900,
                        color: 'white',
                        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)',
                        marginRight: 20
                    }}>K</div>
                    <h1 style={{ fontSize: 80, fontWeight: 900, margin: 0, letterSpacing: '-0.05em' }}>Koky.bz</h1>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '0 40px'
                }}>
                    <h2 style={{
                        fontSize: 60,
                        fontWeight: 800,
                        background: 'linear-gradient(to right, #60a5fa, #34d399)',
                        backgroundClip: 'text',
                        color: 'transparent',
                        margin: '0 0 20px 0',
                        lineHeight: 1.1
                    }}>
                        Start Earning Today!
                    </h2>
                    <p style={{ fontSize: 32, color: '#94a3b8', maxWidth: 800, margin: 0, lineHeight: 1.5 }}>
                        Join 15,000+ users earning real money by completing simple tasks.
                    </p>

                    <div style={{
                        display: 'flex',
                        marginTop: 40,
                        gap: 20
                    }}>
                        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '10px 24px', fontSize: 24, fontWeight: 600 }}>
                            💸 Instant Payouts
                        </div>
                        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '10px 24px', fontSize: 24, fontWeight: 600 }}>
                            🚀 High Commission
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
