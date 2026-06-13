import { AppShell } from "@/components/layout/AppShell";
import { TaskBoard } from "@/components/game/TaskBoard";

export default function TasksPage() {
  return (
    <AppShell compact>
      <section className="page-panel">
        <div className="section-heading">
          <h1>Task Board</h1>
          <span>Daily care, training, work, adventure, and event runs</span>
        </div>
        <TaskBoard />
      </section>
    </AppShell>
  );
}
