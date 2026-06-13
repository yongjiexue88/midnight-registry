type StatBarProps = {
  label: string;
  value: number;
  max?: number;
  icon?: string;
  tone?: string;
};

export function StatBar({ label, value, max = 100, icon = "fa-heart", tone = "pink" }: StatBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="stat-bar" data-tone={tone}>
      <span className="stat-bar__icon">
        <i className={`fa-solid ${icon}`} aria-hidden="true" />
      </span>
      <div className="stat-bar__body">
        <div className="stat-bar__label">
          <strong>{label}</strong>
          <span>
            {Math.round(value)} / {max}
          </span>
        </div>
        <div className="bar-track">
          <span style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}
