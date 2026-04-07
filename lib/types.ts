export type JobFormat = "markdown" | "pdf" | "both";
export type JobStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export interface ArtifactInfo {
  name: string;
  filename: string;
  media_type: string;
  size_bytes?: number | null;
}

export interface CrawlCounts {
  discovered: number;
  processed: number;
  failed: number;
}

export interface JobCreateRequest {
  url: string;
  formats: JobFormat;
  include_assets: boolean;
}

export interface JobRecord {
  id: string;
  status: JobStatus;
  request: JobCreateRequest;
  detected_framework?: string | null;
  phase?: string | null;
  progress_message?: string | null;
  progress_percent: number;
  cancel_requested: boolean;
  warnings: string[];
  counts: CrawlCounts;
  artifacts: ArtifactInfo[];
  created_at: string;
  updated_at: string;
  error?: string | null;
}
