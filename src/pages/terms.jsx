import { Link } from 'react-router-dom'

const Section = ({ title, children }) => (
    <div style={{ marginBottom: '40px' }}>
        <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '20px',
            color: '#C8C8C8',
            letterSpacing: '0.15em',
            marginBottom: '14px',
        }}>{title}</h2>
        <div style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.8,
        }}>{children}</div>
    </div>
)

const P = ({ children }) => <p style={{ marginBottom: '12px' }}>{children}</p>

const UL = ({ items }) => (
    <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
        {items.map((item, i) => (
            <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
        ))}
    </ul>
)

export default function Terms() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            padding: '60px 24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.06,
                backgroundImage:
                    'linear-gradient(rgba(200,200,200,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(200,200,200,0.15) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
                pointerEvents: 'none',
            }} />

            <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

                <Link to="/" style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.25)',
                    textDecoration: 'none',
                    letterSpacing: '0.1em',
                    display: 'inline-block',
                    marginBottom: '48px',
                    transition: 'color 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.color = '#C8C8C8'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                >
                    ← BACK TO SITE
                </Link>

                <div style={{ marginBottom: '52px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#C8C8C8', letterSpacing: '0.2em' }}>ALTUS</span>
                        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '11px', background: '#C8C8C8', color: '#0a0a0a', padding: '3px 8px', letterSpacing: '0.1em', borderRadius: '4px' }}>AERO</span>
                    </div>
                    <h1 style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 'clamp(32px, 6vw, 48px)',
                        color: '#ffffff',
                        letterSpacing: '0.05em',
                        lineHeight: 1.05,
                        marginBottom: '16px',
                    }}>TERMS OF SERVICE</h1>
                    <p style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.25)',
                        letterSpacing: '0.08em',
                    }}>Last updated: April 2026</p>
                </div>

                <div style={{
                    background: 'rgba(200,200,200,0.05)',
                    border: '1px solid rgba(200,200,200,0.15)',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    marginBottom: '48px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.7,
                }}>
                    Please read these Terms of Service carefully before using Altus Aero. By accessing or using our platform, you agree to be bound by these terms. If you do not agree, do not use the platform.
                </div>

                <Section title="1. ACCEPTANCE OF TERMS">
                    <P>These Terms of Service ("Terms") govern your use of Altus Aero, operated by Anirudh Shinde ("we", "us", or "our"), accessible at altus-aero.vercel.app. By creating an account or using any part of the platform, you agree to these Terms in full.</P>
                    <P>We reserve the right to update these Terms at any time. Continued use of the platform after changes constitutes acceptance.</P>
                </Section>

                <Section title="2. DESCRIPTION OF SERVICE">
                    <P>Altus Aero is a broker intelligence and market education SaaS platform for private aviation professionals. The platform provides:</P>
                    <UL items={[
                        'Educational content on private aviation brokerage',
                        'Aircraft fleet intelligence and comparison tools',
                        'Charter cost planning and route estimation tools',
                        'Market signals and industry data (educational context only)',
                        'Flight tracking information (sourced from third-party providers)',
                        'An AI-powered chatbot for broker education queries',
                    ]} />
                </Section>

                <Section title="3. EDUCATIONAL PURPOSE — NOT PROFESSIONAL ADVICE">
                    <P style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                        All content on Altus Aero is provided for educational and informational purposes only.
                    </P>
                    <P>Nothing on this platform constitutes financial advice, legal advice, investment advice, or a solicitation to buy or sell any asset, aircraft, or financial instrument. Altus Aero is not a licensed financial advisor, aviation consultant, or legal professional.</P>
                    <P>Charter cost estimates, route planning outputs, and market signals are approximations based on publicly available data and general industry knowledge. They should not be used as the sole basis for any commercial, financial, or operational decision.</P>
                    <P>Always conduct your own due diligence and consult qualified professionals before making any aviation or business decisions.</P>
                </Section>

                <Section title="4. ACCOUNT REGISTRATION">
                    <P>To access the platform, you must create an account. You agree to:</P>
                    <UL items={[
                        'Provide accurate and complete information during registration',
                        'Keep your login credentials confidential',
                        'Notify us immediately of any unauthorized use of your account',
                        'Be at least 18 years of age',
                        'Use the platform only for lawful, professional purposes',
                    ]} />
                    <P>We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably believe are being used fraudulently.</P>
                </Section>

                <Section title="5. SUBSCRIPTION PLANS AND PAYMENTS">
                    <P>Altus Aero offers a Free plan and a Pro plan. Features available under each plan are described on the platform.</P>
                    <P><strong style={{ color: 'rgba(255,255,255,0.7)' }}>Free Plan:</strong> Available at no cost with limited features.</P>
                    <P><strong style={{ color: 'rgba(255,255,255,0.7)' }}>Pro Plan:</strong> Paid subscription at rates displayed on the billing page. Payments are processed via Razorpay. By subscribing, you authorize us to charge the applicable fees to your chosen payment method.</P>
                    <UL items={[
                        'Subscriptions are billed monthly or annually as selected',
                        'All fees are in Indian Rupees (INR) unless otherwise stated',
                        'Taxes may apply based on your location',
                        'Refunds are handled on a case-by-case basis — contact anirudh.jets@gmail.com within 7 days of a charge',
                    ]} />
                    <P>We reserve the right to change pricing with 30 days notice to existing subscribers.</P>
                </Section>

                <Section title="6. ACCEPTABLE USE">
                    <P>You agree not to:</P>
                    <UL items={[
                        'Use the platform for any unlawful purpose',
                        'Attempt to reverse-engineer, scrape, or copy the platform\'s content or code',
                        'Share your account credentials with others',
                        'Use automated tools to access the platform without permission',
                        'Upload or transmit harmful, offensive, or infringing content',
                        'Attempt to gain unauthorized access to any part of the platform or its infrastructure',
                        'Misrepresent your identity or affiliation',
                    ]} />
                </Section>

                <Section title="7. INTELLECTUAL PROPERTY">
                    <P>All content on Altus Aero — including text, data, tools, design, graphics, and code — is owned by or licensed to us and protected by applicable intellectual property laws.</P>
                    <P>You are granted a limited, non-exclusive, non-transferable license to access and use the platform for your personal professional use. You may not reproduce, distribute, or create derivative works from our content without prior written consent.</P>
                </Section>

                <Section title="8. THIRD-PARTY DATA AND SERVICES">
                    <P>The platform integrates with third-party services including Supabase, Vercel, Razorpay, and Anthropic. We are not responsible for the availability, accuracy, or conduct of these services.</P>
                    <P>Flight data and market signals displayed on the platform are sourced from third-party providers and may be delayed, incomplete, or inaccurate. We make no warranties regarding the accuracy of this data.</P>
                </Section>

                <Section title="9. DISCLAIMERS AND LIMITATION OF LIABILITY">
                    <P>The platform is provided "as is" and "as available" without warranties of any kind, express or implied.</P>
                    <P>To the maximum extent permitted by law, Altus Aero and its operator shall not be liable for:</P>
                    <UL items={[
                        'Any indirect, incidental, or consequential damages arising from your use of the platform',
                        'Loss of profits, revenue, or data',
                        'Decisions made based on content or tools provided on the platform',
                        'Interruptions, errors, or downtime of the platform',
                    ]} />
                    <P>Our total liability to you for any claim shall not exceed the amount you paid us in the 3 months preceding the claim.</P>
                </Section>

                <Section title="10. GOVERNING LAW">
                    <P>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra, India.</P>
                    <P>For users in the EU or UK, nothing in these Terms limits your statutory consumer rights under applicable local law.</P>
                </Section>

                <Section title="11. TERMINATION">
                    <P>You may delete your account at any time by contacting us at anirudh.jets@gmail.com. We may suspend or terminate your access at any time if you breach these Terms.</P>
                    <P>Upon termination, your right to use the platform ceases immediately. Sections 3, 7, 9, and 10 survive termination.</P>
                </Section>

                <Section title="12. CONTACT">
                    <P>For any questions about these Terms, contact us at:</P>
                    <P style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#C8C8C8' }}>
                        anirudh.jets@gmail.com
                    </P>
                </Section>

                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '32px',
                    marginTop: '16px',
                    display: 'flex',
                    gap: '24px',
                    flexWrap: 'wrap',
                }}>
                    <Link to="/privacy" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', letterSpacing: '0.08em' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#C8C8C8'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                    >PRIVACY POLICY</Link>
                    <Link to="/" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', letterSpacing: '0.08em' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#C8C8C8'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                    >BACK TO HOME</Link>
                </div>

            </div>
        </div>
    )
}