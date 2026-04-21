export function AnalyticsSection({ title, description, className = "", children }) {
  return (
    <section className={`analytics-section ${className}`.trim()}>
      <div className="analytics-section__header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}
