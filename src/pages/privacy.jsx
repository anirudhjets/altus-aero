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

export default function Privacy() {
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
                    }}>PRIVACY POLICY</h1>
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
                    This Privacy Policy explains how Altus Aero ("we", "us", or "our") collects, uses, and protects your personal information when you use our platform at altus-aero.vercel.app. By using our platform, you agree to the practices described in this policy.
                </div>

                <Section title="1. WHO WE ARE">
                    <P>Altus Aero is a broker intelligence and market education platform for private aviation professionals. We are operated by Anirudh Shinde, based in Mumbai, India. For privacy-related queries, contact us at anirudh.jets@gmail.com.</P>
                </Section>

                <Section title="2. INFORMATION WE COLLECT">
                    <P>We collect the following information when you use Altus Aero:</P>
                    <P><strong style={{ color: 'rgba(255,255,255,0.7)' }}>Account Information</strong></P>
                    <UL items={[
                        'Email address (when you sign up or sign in)',
                        'Full name (when you register)',
                        'Authentication provider data (if you sign in via Google)',
                    ]} />
                    <P><strong style={{ color: 'rgba(255,255,255,0.7)' }}>Usage Data</strong></P>
                    <UL items={[
                        'Number of sessions and active days on the platform',
                        'Number of routes planned using the Plan tool',
                        'Number of aircraft profiles viewed in the Fleet tool',
                        'Subscription plan status (Free or Pro)',
                    ]} />
                    <P>Usage data is stored locally in your browser (localStorage) and is not transmitted to our servers unless explicitly synced.</P>
                    <P><strong style={{ color: 'rgba(255,255,255,0.7)' }}>Technical Data</strong></P>
                    <UL items={[
                        'IP address and browser type (collected by our hosting provider, Vercel)',
                        'Device type and operating system',
                        'Pages visited and time spent on the platform',
                    ]} />
                </Section>

                <Section title="3. HOW WE USE YOUR INFORMATION">
                    <P>We use your information for the following purposes:</P>
                    <UL items={[
                        'To create and manage your account',
                        'To provide access to the platform and its features',
                        'To track your usage limits under your subscription plan',
                        'To communicate with you about your account or subscription',
                        'To improve the platform based on usage patterns',
                        'To process payments when you subscribe to a paid plan (via Razorpay)',
                        'To comply with legal obligations',
                    ]} />
                    <P>We do not sell your personal data to third parties. We do not use your data for advertising purposes.</P>
                </Section>

                <Section title="4. COOKIES AND LOCAL STORAGE">
                    <P>Altus Aero uses the following storage mechanisms:</P>
                    <P><strong style={{ color: 'rgba(255,255,255,0.7)' }}>Authentication Cookies</strong><br />
                        Supabase sets a session cookie to keep you logged in. This cookie is essential for the platform to function and cannot be disabled.</P>
                    <P><strong style={{ color: 'rgba(255,255,255,0.7)' }}>localStorage</strong><br />
                        We store your usage statistics (sessions, routes planned, fleet views) in your browser's localStorage under the key <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#C8C8C8' }}>altus_usage</span>. This data stays on your device.</P>
                    <P>We do not use advertising cookies, tracking pixels, or third-party analytics cookies at this time.</P>
                </Section>

                <Section title="5. DATA SHARING AND THIRD PARTIES">
                    <P>We share your data only with the following service providers, strictly to operate the platform:</P>
                    <UL items={[
                        'Supabase (authentication and database) — supabase.com',
                        'Vercel (hosting and deployment) — vercel.com',
                        'Razorpay (payment processing, when applicable) — razorpay.com',
                        'Anthropic (AI chatbot functionality) — anthropic.com',
                    ]} />
                    <P>Each of these providers has their own privacy policy and is responsible for their own data handling practices. We encourage you to review them.</P>
                    <P>We do not share your data with advertisers, data brokers, or any other third parties.</P>
                </Section>

                <Section title="6. INTERNATIONAL USERS">
                    <P>Altus Aero is operated from India and serves users globally. By using our platform, you consent to your data being processed in India and in any country where our third-party service providers operate (including the United States, where Supabase and Vercel are based).</P>
                    <P><strong style={{ color: 'rgba(255,255,255,0.7)' }}>For users in the European Economic Area (EEA) and UK:</strong><br />
                        We process your data on the basis of contract performance (to provide the service you signed up for) and legitimate interests. You have the right to access, rectify, erase, restrict, or port your personal data. To exercise these rights, contact us at anirudh.jets@gmail.com.</P>
                    <P><strong style={{ color: 'rgba(255,255,255,0.7)' }}>For users in California (CCPA):</strong><br />
                        We do not sell personal information. You have the right to know what data we collect and to request deletion of your data.</P>
                    <P><strong style={{ color: 'rgba(255,255,255,0.7)' }}>For users in India (DPDP Act 2023):</strong><br />
                        We collect and process your data only for the purposes described in this policy. You have the right to access and correct your data, and to withdraw consent where applicable.</P>
                </Section>

                <Section title="7. DATA RETENTION">
                    <P>We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or compliance reasons.</P>
                    <P>Usage data stored in localStorage is retained on your device until you clear your browser data or uninstall the browser.</P>
                </Section>

                <Section title="8. DATA SECURITY">
                    <P>We take reasonable technical measures to protect your data, including:</P>
                    <UL items={[
                        'HTTPS encryption for all data in transit',
                        'Supabase row-level security for database access',
                        'No storage of passwords in plain text (handled by Supabase Auth)',
                    ]} />
                    <P>No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</P>
                </Section>

                <Section title="9. CHILDREN'S PRIVACY">
                    <P>Altus Aero is intended for professional use by adults (18+). We do not knowingly collect data from individuals under 18. If you believe a minor has provided us with personal data, contact us and we will delete it promptly.</P>
                </Section>

                <Section title="10. CHANGES TO THIS POLICY">
                    <P>We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. We encourage you to review this policy periodically. Continued use of the platform after changes constitutes acceptance of the updated policy.</P>
                </Section>

                <Section title="11. CONTACT US">
                    <P>For any privacy-related questions, requests, or concerns, contact us at:</P>
                    <P style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#C8C8C8' }}>
                        anirudh.jets@gmail.com
                    </P>
                    <P>We aim to respond to all requests within 7 business days.</P>
                </Section>

                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '32px',
                    marginTop: '16px',
                    display: 'flex',
                    gap: '24px',
                    flexWrap: 'wrap',
                }}>
                    <Link to="/terms" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', letterSpacing: '0.08em' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#C8C8C8'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                    >TERMS OF SERVICE</Link>
                    <Link to="/" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', letterSpacing: '0.08em' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#C8C8C8'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                    >BACK TO HOME</Link>
                </div>

            </div>
        </div>
    )
}