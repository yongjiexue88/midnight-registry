type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
};

export function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="progress-wrap" aria-label={label}>
      {label ? <span>{label}</span> : null}
      <div className="bar-track">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
