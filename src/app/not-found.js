import Link from "next/link";

export const metadata = {
  title: "404 | Page Not Found - StudioSpace",
};

export default function NotFound() {
  return (
    <section className="nf">
      <div className="container nf-inner">
        <img src="/404-not-found.svg" alt="404 - Scene not found" className="nf-art" />
        <span className="nf-tag">Error 404</span>
        <h1>
          This scene <span className="text-gradient">wasn&apos;t found</span>
        </h1>
        <p>
          The page you are looking for may have been moved, deleted, or never existed.
          Let&apos;s get you back to the set.
        </p>
        <div className="nf-actions">
          <Link href="/" className="btn btn-primary">Back to Home</Link>
          <Link href="/studios" className="btn btn-outline">Explore Studios</Link>
        </div>
      </div>
    </section>
  );
}