export const metadata = { title: 'Terms of Service | StudioSpace' };

export default function TermsPage() {
  return (
    <section className="container">
      <div className="doc">
        <h1>Terms of Service</h1>
        <p>Last updated: November 2026</p>
        <h2>1. Using StudioSpace</h2>
        <p>
          You must provide accurate information when you create an account, list
          a studio or request a booking. You are responsible for activity under
          your account.
        </p>
        <h2>2. Bookings</h2>
        <p>
          A booking request is pending until the host confirms it. A confirmed
          booking reserves the chosen time slot. Pending bookings can be
          cancelled by the guest at any time before confirmation.
        </p>
        <h2>3. Hosts</h2>
        <p>
          Hosts must describe their space honestly, keep their listing up to
          date and respond to booking requests promptly.
        </p>
        <h2>4. Care of spaces</h2>
        <p>
          Guests must treat studios and equipment with care and leave the space
          in the condition they found it. Security deposits may be applied to
          damage.
        </p>
        <h2>5. Changes</h2>
        <p>
          We may update these terms as the platform grows. Continued use of
          StudioSpace means you accept the updated terms.
        </p>
      </div>
    </section>
  );
}
