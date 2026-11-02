// Shared heading used by EVERY section, so font, size and color stay identical
// (requirement: "Keep the main heading style consistent across all sections").
// Styles live in app/globals.css (.sec-head, .eyebrow, .title, .sub).

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}) {
  return (
    <div className={`sec-head sec-head-${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="title">{title}</h2>
      {subtitle && <p className="sub">{subtitle}</p>}
    </div>
  );
}
