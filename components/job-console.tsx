"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";

import { cancelJob, createJob, getArtifactUrl, getJob } from "@/lib/api";
import type { ArtifactInfo, JobFormat, JobRecord, JobStatus } from "@/lib/types";

const formatOptions: Array<{ value: JobFormat; label: string; note: string }> = [
  {
    value: "markdown",
    label: "Markdown only",
    note: "Fastest option.",
  },
  {
    value: "both",
    label: "Markdown + PDF",
    note: "Best default.",
  },
  {
    value: "pdf",
    label: "PDF only",
    note: "PDF output only.",
  },
];

export function JobConsole() {
  const [url, setUrl] = useState("https://opencode.ai/docs/");
  const [format, setFormat] = useState<JobFormat>("markdown");
  const [includeAssets, setIncludeAssets] = useState(true);
  const [job, setJob] = useState<JobRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasActiveJob = job ? !isTerminalStatus(job.status) : false;
  const isCancelling = Boolean(job && hasActiveJob && job.cancel_requested);
  const progress = job ? getProgress(job) : 0;
  const phaseLabel = describePhase(job?.phase);

  useEffect(() => {
    if (!job || isTerminalStatus(job.status)) {
      return;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        const next = await getJob(job.id);
        if (!cancelled) {
          setJob(next);
        }
      } catch (pollError) {
        if (!cancelled) {
          setError(
            pollError instanceof Error
              ? pollError.message
              : "Unable to refresh job status.",
          );
        }
      }
    };

    void poll();
    const interval = window.setInterval(() => {
      void poll();
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [job?.id, job?.status]);

  const submitJob = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hasActiveJob) {
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          setError(null);
          const created = await createJob({
            url,
            formats: format,
            include_assets: includeAssets,
          });
          setJob(created);
        } catch (submitError) {
          setError(
            submitError instanceof Error
              ? submitError.message
              : "Unable to submit this documentation export.",
          );
        }
      })();
    });
  };

  const requestCancel = () => {
    if (!job || isTerminalStatus(job.status) || job.cancel_requested) {
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          setError(null);
          const updated = await cancelJob(job.id);
          setJob(updated);
        } catch (cancelError) {
          setError(
            cancelError instanceof Error
              ? cancelError.message
              : "Unable to cancel this documentation export.",
          );
        }
      })();
    });
  };

  return (
    <section className="console-grid">
      <form className="panel panel-form" onSubmit={submitJob}>
        <div className="panel-head">
          <p className="eyebrow">Queue Export</p>
          <h2>Submit a documentation root URL.</h2>
          <p className="panel-copy">
            Choose a URL, pick the output, and start the conversion.
          </p>
        </div>

        <label className="field">
          <span>Documentation URL</span>
          <input
            className="input"
            type="url"
            name="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://docs.example.com"
            required
            disabled={hasActiveJob}
          />
        </label>

        <fieldset className="field fieldset-reset">
          <legend>Output format</legend>
          <div className="segmented">
            {formatOptions.map((option) => (
              <label
                key={option.value}
                className="option"
                data-active={format === option.value ? "true" : "false"}
              >
                <input
                  type="radio"
                  name="format"
                  value={option.value}
                  checked={format === option.value}
                  onChange={() => setFormat(option.value)}
                  disabled={hasActiveJob}
                />
                <span className="option-label">{option.label}</span>
                <span className="option-note">{option.note}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="toggle">
          <input
            type="checkbox"
            checked={includeAssets}
            onChange={(event) => setIncludeAssets(event.target.checked)}
            disabled={hasActiveJob}
          />
          <span>Download images and linked media into the export bundle</span>
        </label>

        <div className="form-actions">
          {hasActiveJob ? (
            <button
              className="danger-button"
              type="button"
              onClick={requestCancel}
              disabled={isPending || isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel conversion"}
            </button>
          ) : (
            <button className="primary-button" type="submit" disabled={isPending}>
              {isPending ? "Submitting export..." : "Start conversion"}
            </button>
          )}
        </div>

        {error ? <p className="error-text">{error}</p> : null}
      </form>

      <section className="panel panel-status">
        <div className="panel-head">
          <p className="eyebrow">Job Status</p>
          <h2>{job ? `Job ${job.id.slice(0, 8)}` : "No active export yet"}</h2>
          <p className="panel-copy">
            {job
              ? "Live progress, warnings, and downloads appear here."
              : "Start a conversion to see progress and downloads here."}
          </p>
        </div>

        {job ? (
          <>
            <div className="status-row">
              <span className={`status-pill status-${job.status}`}>{job.status}</span>
              <span className="status-meta">
                Framework: {job.detected_framework ?? "Detecting..."}
              </span>
            </div>

            <div className="progress-card">
              <div className="progress-labels">
                <span>{phaseLabel}</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-track">
                <div
                  className={`progress-fill ${hasActiveJob ? "progress-active" : ""}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="progress-message">
                {job.progress_message ?? defaultProgressMessage(job)}
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Pages</span>
                <strong>
                  {job.counts.processed} / {job.counts.discovered || "?"}
                </strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Failures</span>
                <strong>{job.counts.failed}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Format</span>
                <strong>{describeFormat(job.request.formats)}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Assets</span>
                <strong>{job.request.include_assets ? "Included" : "Skipped"}</strong>
              </div>
            </div>

            {job.artifacts.length > 0 ? (
              <div className="artifact-group">
                <div className="section-head">
                  <h3>Artifacts</h3>
                  <span>{job.artifacts.length}</span>
                </div>
                <div className="artifact-list">
                  {job.artifacts.map((artifact) => (
                    <ArtifactLink
                      key={artifact.filename}
                      artifact={artifact}
                      jobId={job.id}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {job.warnings.length > 0 ? (
              <div className="warning-group">
                <div className="section-head">
                  <h3>Warnings</h3>
                  <span>{job.warnings.length}</span>
                </div>
                <ul className="warning-list">
                  {job.warnings.slice(0, 12).map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {job.error ? <p className="error-text">{job.error}</p> : null}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-kicker">Ready</div>
            <p>Run a conversion to track progress and download the finished artifacts.</p>
          </div>
        )}
      </section>
    </section>
  );
}

function ArtifactLink({
  artifact,
  jobId,
}: {
  artifact: ArtifactInfo;
  jobId: string;
}) {
  const href = getArtifactUrl(jobId, artifact.filename);

  return (
    <a className="artifact-link" href={href} target="_blank" rel="noreferrer">
      <div className="artifact-copy">
        <span>{artifact.filename}</span>
        <small>{artifact.media_type}</small>
      </div>
      <div className="artifact-action" aria-hidden="true">
        <DownloadIcon />
        <div className="artifact-meta">
          <strong>Download</strong>
          <small>{formatBytes(artifact.size_bytes)}</small>
        </div>
      </div>
    </a>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="artifact-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v11" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function getProgress(job: JobRecord): number {
  if (job.progress_percent > 0) {
    return job.progress_percent;
  }

  const total = job.counts.discovered;
  if (!total) {
    return job.status === "completed" ? 100 : 0;
  }

  return Math.min(100, Math.round((job.counts.processed / total) * 100));
}

function formatBytes(size?: number | null): string {
  if (size == null) {
    return "Pending";
  }
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function isTerminalStatus(status: JobStatus): boolean {
  return status === "completed" || status === "failed" || status === "cancelled";
}

function describeFormat(format: JobFormat): string {
  switch (format) {
    case "markdown":
      return "Markdown";
    case "pdf":
      return "PDF";
    case "both":
      return "Both";
    default:
      return format;
  }
}

function describePhase(phase?: string | null): string {
  switch (phase) {
    case "queued":
      return "Queued";
    case "starting":
      return "Starting";
    case "crawling":
      return "Crawling";
    case "cancelling":
      return "Cancelling";
    case "exporting":
      return "Building Markdown";
    case "pdf":
      return "Generating PDF";
    case "packaging":
      return "Packaging";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Waiting";
  }
}

function defaultProgressMessage(job: JobRecord): string {
  if (job.status === "completed") {
    return "Export complete.";
  }
  if (job.status === "failed") {
    return "Export failed.";
  }
  if (job.status === "cancelled") {
    return "Export cancelled.";
  }
  if (job.cancel_requested) {
    return "Cancellation requested. Stopping after the current step.";
  }
  return "Waiting for the next progress update.";
}
