import type { JobCreateRequest, JobRecord } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

async function readJsonOrError<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }

  let message = `Request failed with status ${response.status}`;
  try {
    const payload = (await response.json()) as { detail?: string };
    if (payload.detail) {
      message = payload.detail;
    }
  } catch {
    // Keep the default message when the response is not JSON.
  }
  throw new Error(message);
}

export async function createJob(payload: JobCreateRequest): Promise<JobRecord> {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return readJsonOrError<JobRecord>(response);
}

export async function getJob(jobId: string): Promise<JobRecord> {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    cache: "no-store",
  });
  return readJsonOrError<JobRecord>(response);
}

export async function cancelJob(jobId: string): Promise<JobRecord> {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/cancel`, {
    method: "POST",
  });
  return readJsonOrError<JobRecord>(response);
}

export function getArtifactUrl(jobId: string, filename: string): string {
  return `${API_BASE_URL}/jobs/${jobId}/artifacts/${filename}`;
}
