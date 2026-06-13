type BadgeProps = {
  children: string;
  tone?: string;
  icon?: string;
};

export function Badge({ children, tone = "neutral", icon }: BadgeProps) {
  return (
    <span className="badge" data-tone={tone}>
      {icon ? <i className={`fa-solid ${icon}`} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
