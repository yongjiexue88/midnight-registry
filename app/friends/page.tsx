import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

export default function FriendsPage() {
  return (
    <AppShell compact>
      <section className="page-panel">
        <div className="section-heading">
          <h1>Friends</h1>
          <span>Social hooks for future Supabase-backed visits</span>
        </div>
        <div className="friend-grid">
          {["Sunny Plaza", "Cloud Cafe", "Ribbon Studio"].map((name, index) => (
            <Card key={name} title={name} eyebrow={`Friend Town ${index + 1}`}>
              <p>Visit, send a care gift, and compare companion growth in a future multiplayer loop.</p>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
