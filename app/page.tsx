import { JobConsole } from "@/components/job-console";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-cluster">
          <div className="brand-mark">DP</div>
          <div className="brand-copy">
            <p className="eyebrow">Internal Operator Console</p>
            <p className="brand-title">DocToPDF</p>
          </div>
        </div>

        <div className="topbar-actions">
          <ThemeToggle />
        </div>
      </header>

      <section className="hero hero-single">
        <div className="hero-copy panel">
          <p className="hero-badge">DocToPDF v1</p>
          <h1>Convert documentation sites into Markdown and PDF.</h1>
          <p className="hero-summary">
            Enter a docs URL, start the conversion, and download the finished files from one
            simple workspace.
          </p>
        </div>
      </section>

      <JobConsole />
    </main>
  );
}
