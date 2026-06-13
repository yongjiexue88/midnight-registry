import { AppShell } from "@/components/layout/AppShell";
import { CareActions } from "@/components/game/CareActions";
import { InventoryPanel } from "@/components/game/InventoryPanel";
import { PetCarousel } from "@/components/game/PetCarousel";
import { RewardModal } from "@/components/game/RewardModal";
import { TaskBoard } from "@/components/game/TaskBoard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatBar } from "@/components/ui/StatBar";

const colors = [
  ["Ink", "var(--color-ink)"],
  ["Muted", "var(--color-muted)"],
  ["Surface", "var(--color-surface)"],
  ["Peach", "var(--color-peach)"],
  ["Cyan", "var(--color-cyan)"],
  ["Lime", "var(--color-lime)"],
  ["Gold", "var(--color-gold)"],
  ["Pink", "var(--color-pink)"],
];

export default function DesignSystemPage() {
  return (
    <AppShell compact>
      <section className="page-panel design-system-page">
        <div className="section-heading">
          <h1>Design System</h1>
          <span>Reusable game UI components and CSS variables for Figma sync</span>
        </div>

        <section className="ds-section">
          <h2>Color Tokens</h2>
          <div className="color-token-grid">
            {colors.map(([name, value]) => (
              <span key={name}>
                <i style={{ background: value }} />
                <strong>{name}</strong>
                <small>{value}</small>
              </span>
            ))}
          </div>
        </section>

        <section className="ds-section">
          <h2>Typography</h2>
          <div className="type-sample">
            <h1>Pocket Town H1</h1>
            <h2>Reusable Component Heading</h2>
            <p>Rounded, compact, high-contrast labels keep the game UI readable in dense panels.</p>
          </div>
        </section>

        <section className="ds-section">
          <h2>Buttons</h2>
          <div className="component-row">
            <Button icon="fa-play">Primary</Button>
            <Button variant="secondary" icon="fa-heart">Secondary</Button>
            <Button variant="ghost" icon="fa-lock">Ghost</Button>
            <Button variant="icon" icon="fa-star" aria-label="Icon button" />
          </div>
        </section>

        <section className="ds-section">
          <h2>Cards</h2>
          <div className="component-grid">
            <Card title="Game Card" eyebrow="Surface">
              <p>Shared 8px-radius card surface for repeated panels, shop slots, task rows, and friends.</p>
            </Card>
            <Card title="Location Card" eyebrow="Town">
              <p>Uses DOM text and iconography, never baked into background art.</p>
            </Card>
          </div>
        </section>

        <section className="ds-section">
          <h2>Stat Bars</h2>
          <div className="component-grid">
            <StatBar label="Hunger" value={70} icon="fa-burger" tone="orange" />
            <StatBar label="Mood" value={84} icon="fa-face-smile" tone="lime" />
            <StatBar label="Energy" value={48} icon="fa-bolt" tone="gold" />
          </div>
        </section>

        <section className="ds-section">
          <h2>Pet Cards</h2>
          <PetCarousel />
        </section>

        <section className="ds-section">
          <h2>Task Cards</h2>
          <TaskBoard compact />
        </section>

        <section className="ds-section">
          <h2>Inventory Grid</h2>
          <InventoryPanel />
        </section>

        <section className="ds-section">
          <h2>Care Actions</h2>
          <CareActions />
        </section>

        <section className="ds-section">
          <h2>Reward Modal</h2>
          <p>Run a task on `/town` to open the reusable reward modal with live rewards and level-up state.</p>
          <RewardModal />
        </section>
      </section>
    </AppShell>
  );
}
