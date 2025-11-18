// lib/processing.ts
import { API_BASE, DEMO_PROCESSING } from './config';

export type ProcessingStatus =
  | { status: 'pending' | 'running'; etaSeconds?: number }
  | { status: 'done'; fileIdFinal: string; webViewLink?: string; webContentLink?: string }
  | { status: 'error'; message?: string };

export async function fetchProcessingStatus(jobId: string): Promise<ProcessingStatus> {
  // 🔹 MODO DEMO: no llamamos al backend, devolvemos "done" directo
  if (DEMO_PROCESSING) {
    console.log('🔁 DEMO: simulando procesamiento IA para jobId', jobId);
    // Espera un poco para que se vea el loader
    await new Promise((r) => setTimeout(r, 2500));

    return {
      status: 'done',
      fileIdFinal: `demo-file-${jobId}`,
      webViewLink: 'https://example.com/demo-final-view',
      webContentLink: 'https://example.com/demo-final-model.usdz',
    };
  }

  // 🔸 Código real (cuando exista el endpoint en tu backend)
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
