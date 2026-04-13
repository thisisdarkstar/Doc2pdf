import { JobConsole } from "@/components/job-console";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "DocToPDF",
        url: "https://webdoctopdf.vercel.app",
        description:
          "DocToPDF converts documentation websites into PDF and Markdown files with one URL.",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        author: {
          "@type": "Organization",
          name: "DocToPDF",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Can I convert web documentation to PDF?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. DocToPDF converts website documentation into downloadable PDF files with one docs URL.",
            },
          },
          {
            "@type": "Question",
            name: "Can I save documentation as Markdown?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. DocToPDF exports documentation websites into Markdown files so you can edit docs as MD.",
            },
          },
          {
            "@type": "Question",
            name: "Does DocToPDF work with any documentation site?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "DocToPDF supports converting most web documentation sites into PDF or Markdown files with a simple URL input.",
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
          <p className="hero-badge">Convert Web Documentation to PDF + Markdown</p>
          <h1>Convert documentation websites into PDF and Markdown.</h1>
          <p className="hero-summary">
            Paste a docs URL, start the conversion, and download the finished PDF or Markdown files from one simple workspace.
          </p>
          <div className="seo-features">
            <p>Use DocToPDF to convert web documentation to PDF, export website documentation to Markdown, or save docs pages as MD files.</p>
            <ul>
              <li>Web documentation to PDF</li>
              <li>Web documentation to Markdown</li>
              <li>Documentation site exporter</li>
            </ul>
          </div>
        </div>
      </section>

      <JobConsole />

      <section className="faq panel">
        <h2>Quick answers</h2>
        <div className="faq-item">
          <strong>Can I convert web documentation to PDF?</strong>
          <p>Yes — DocToPDF exports documentation sites into ready-to-download PDF files.</p>
        </div>
        <div className="faq-item">
          <strong>Can I save documentation as Markdown?</strong>
          <p>Yes — export website documentation into Markdown files for easy editing and version control.</p>
        </div>
        <div className="faq-item">
          <strong>Does it work with docs sites?</strong>
          <p>Most documentation websites can be converted to PDF or Markdown by entering the docs URL.</p>
        </div>
      </section>
    </main>
  );
}
