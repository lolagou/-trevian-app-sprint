import { API_BASE } from './config';

export type ProcessingStatus =
  | { status: 'pending' | 'running'; etaSeconds?: number }
  | { status: 'done'; fileIdFinal: string; webViewLink?: string; webContentLink?: string }
  | { status: 'error'; message?: string };

export async function fetchProcessingStatus(jobId: string): Promise<ProcessingStatus> {
  const res = await fetch(`${API_BASE}/processing/status/${jobId}`);
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // si el backend devolvió texto/HTML
  }
  if (!res.ok) {
    return { status: 'error', message: json?.error || `HTTP ${res.status}` };
  }
  if (!json || !json.status) {
    return { status: 'error', message: 'Respuesta inválida del servidor' };
  }
  return json as ProcessingStatus;
}
