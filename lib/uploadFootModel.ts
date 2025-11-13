// lib/uploadFootModel.ts (NUEVO - sin Supabase)
import RNFS from 'react-native-fs';
import { API_BASE } from './config';

type UploadResult = {
  id: string;
  webViewLink?: string;
  webContentLink?: string;
};

async function requestUploadUrl(
  filename: string,
  mime = 'model/vnd.usdz+zip',
  jobId?: string // opcional, para agrupar derecho/izquierdo
): Promise<string> {
  const res = await fetch(`${API_BASE}/drive/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, mime, jobId }),
  });
  const json = await res.json();
  if (!res.ok || !json.uploadUrl) {
    throw new Error(json?.error || 'No se pudo obtener uploadUrl');
  }
  return json.uploadUrl as string;
}

async function putWholeFileToGoogle(
  uploadUrl: string,
  filePath: string,
  mime = 'model/vnd.usdz+zip'
): Promise<UploadResult> {
  // iOS/Android: aseguramos ruta sin "file://"
  const local = filePath.startsWith('file://') ? filePath : `file://${filePath}`;

  // (Opcional) stat para Content-Length (algunos RN no lo requieren)
  let contentLength: string | undefined;
  try {
    const stat = await RNFS.stat(local.replace('file://', ''));
    contentLength = String(stat.size);
  } catch {
    // si falla, lo dejamos undefined
  }

  const headers: Record<string, string> = { 'Content-Type': mime };
  if (contentLength) headers['Content-Length'] = contentLength;

  const res = await fetch(`${uploadUrl}&fields=id,webViewLink,webContentLink`, {
    method: 'PUT',
    headers,
    // @ts-ignore: RN acepta este objeto como body file
    body: { uri: local, type: mime, name: 'scan.usdz' },
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.id) {
    console.error('PUT Drive error:', json);
    throw new Error(json?.error || 'Error subiendo a Drive');
  }
  return json as UploadResult;
}

/**
 * Sube el modelo a Drive usando Service Account (vía backend liviano).
 * Devuelve { id, webViewLink, webContentLink } del archivo en Drive.
 */
export async function uploadFootModelToDrive(
  filePath: string,
  side: 'right' | 'left',
  opts: { jobId?: string } = {}
): Promise<UploadResult> {
  if (!filePath) throw new Error('Ruta de archivo vacía');

  const filename = `${Date.now()}-${side}-scan.usdz`;
  const uploadUrl = await requestUploadUrl(filename, 'model/vnd.usdz+zip', opts.jobId);
  const driveObj = await putWholeFileToGoogle(uploadUrl, filePath, 'model/vnd.usdz+zip');
  return driveObj; // { id, webViewLink?, webContentLink? }
}
