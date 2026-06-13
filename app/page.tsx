import Link from "next/link";

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
            <Link className="btn" href="/town">
              <i className="fa-solid fa-map-location-dot" aria-hidden="true" />
              <span>Enter Town</span>
            </Link>
            <Link className="btn btn--secondary" href="/design-system">
              <i className="fa-solid fa-swatchbook" aria-hidden="true" />
              <span>Design System</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
