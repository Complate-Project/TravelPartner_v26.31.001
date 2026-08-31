import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustStrip } from "./components/TrustStrip";
import { HowItWorks } from "./components/HowItWorks";
import { Experiences } from "./components/Experiences";
import { MembershipTiers } from "./components/MembershipTiers";
import { Safety } from "./components/Safety";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";

export function LandingPage() {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-secondary)',
            overflowX: 'hidden',
            position: 'relative',
            fontFamily: "'Inter', system-ui, sans-serif",
        }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <Navbar />
                <Hero />
                <TrustStrip />
                <HowItWorks />
                <Experiences />
                <MembershipTiers />
                <Safety />
                <FinalCta />
                <Footer />
            </div>
        </div>
    );
}
