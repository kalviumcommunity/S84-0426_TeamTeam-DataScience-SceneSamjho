export function PlaceholderPanel({ label, minHeight = 240 }) {
  return (
    <div className="placeholder-panel" style={{ minHeight }} role="status" aria-live="polite">
      <span>{label}</span>
    </div>
  );
}
