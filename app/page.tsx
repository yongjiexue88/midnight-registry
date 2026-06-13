import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <img src="/assets/backgrounds/reference-pocket-town-companions.png" alt="Pocket Town Companions visual direction" />
        <div className="landing-hero__content">
          <span>Pocket Town Companions</span>
          <h1>Pocket Town Companions</h1>
          <p>A cozy pet town companion game for care routines, task runs, inventory rewards, and reusable game UI systems.</p>
          <div className="landing-actions">
            <Link href="/town"><Button icon="fa-map-location-dot">Enter Town</Button></Link>
            <Link href="/design-system"><Button variant="secondary" icon="fa-swatchbook">Design System</Button></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
