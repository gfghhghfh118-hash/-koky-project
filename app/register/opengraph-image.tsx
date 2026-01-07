
import { ImageResponse } from 'next/og'

// export const runtime = 'edge' // Reverted to Node.js as Edge caused issues

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
                    background: 'linear-gradient(to bottom, #020617, #0f172a)',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background Decoration */}
                <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: '#10b981', filter: 'blur(150px)', opacity: 0.2 }}></div>
                <div style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, background: '#3b82f6', filter: 'blur(150px)', opacity: 0.2 }}></div>

                {/* Main Content Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '2px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 30,
                    padding: '40px 60px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(10px)',
                }}>

                    {/* Header / Logo Area */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{
                            fontSize: 40,
                            background: '#10b981',
                            color: 'white',
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15,
                            boxShadow: '0 0 20px #10b981'
                        }}>K</div>
                        <span style={{ fontSize: 30, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 4 }}>KOKY.BZ</span>
                    </div>

                    {/* Main Headline - SUPER BOLD */}
                    <div style={{
                        display: 'flex',
                        backgroundImage: 'linear-gradient(to right, #ffffff, #4ade80)',
                        backgroundClip: 'text',
                        color: 'transparent',
                        fontSize: 85,
                        fontWeight: 900,
                        textAlign: 'center',
                        lineHeight: 1,
                        marginBottom: 10,
                        textTransform: 'uppercase',
                        textShadow: '0 10px 30px rgba(74, 222, 128, 0.3)'
                    }}>
                        Earn 10% Forever
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 35, color: '#cbd5e1', marginBottom: 40, textAlign: 'center' }}>
                        Invite Friends & Get <span style={{ color: '#fbbf24', fontWeight: 'bold', marginLeft: 10 }}>10% Commission</span> 💰
                    </div>

                    {/* Features / Trust Signals */}
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{
                            background: '#1e293b',
                            padding: '15px 30px',
                            borderRadius: 15,
                            border: '1px solid #334155',
                            fontSize: 24,
                            display: 'flex',
                            alignItems: 'center',
                            color: '#4ade80'
                        }}>
                            ✅ Instant Withdraw
                        </div>
                        <div style={{
                            background: '#1e293b',
                            padding: '15px 30px',
                            borderRadius: 15,
                            border: '1px solid #334155',
                            fontSize: 24,
                            display: 'flex',
                            alignItems: 'center',
                            color: '#fbbf24'
                        }}>
                            🚀 10% Referral Bonus
                        </div>
                    </div>
                </div>

                {/* Call to Action Footer */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: 40,
                    background: '#2563eb',
                    padding: '10px 40px',
                    borderRadius: 50,
                    color: 'white',
                    fontSize: 24,
                    fontWeight: 'bold',
                    boxShadow: '0 0 30px rgba(37, 99, 235, 0.5)'
                }}>
                    Click to Register & Get $0.50 Bonus 🎁
                </div>

            </div>
        ),
        {
            ...size,
        }
    )
}
