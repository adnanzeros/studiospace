// Branded loader: route transition ar async fetch duto jaygay use hoy
export default function Spinner({ label = 'Loading...', inline = false }) {
  return (
    <div
      className={inline ? 'spin-wrap spin-inline' : 'spin-wrap'}
      role="status"
      aria-live="polite"
    >
      <div className="spin-ring">
        <img src="/logo-icon-512.png" alt="" width={34} height={34} />
      </div>
      <p>{label}</p>
    </div>
  );
}
