// lib/uploadFootModel.ts
import * as FileSystem from 'expo-file-system';
import { API_BASE } from './config';

type UploadResult = {
  id: string;
  webViewLink?: string;
  webContentLink?: string;
};

type UploadOpts = {
  jobId?: string;
  userName?: string; // 👈 nuevo
};

async function requestUploadUrl(
  filename: string,
  mime = 'model/vnd.usdz+zip',
  opts: UploadOpts = {}
): Promise<string> {
  const res = await fetch(`${API_BASE}/drive/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename,
      mime,
      jobId: opts.jobId,
      userName: opts.userName, // 👈 se lo mandás al backend
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.uploadUrl) {
    console.error('Error /drive/init:', json);
    throw new Error(json?.error || 'No se pudo obtener uploadUrl');
  }

  return json.uploadUrl as string;
}

async function putWholeFileToGoogle(
  uploadUrl: string,
  filePath: string,
  mime = 'model/vnd.usdz+zip'
): Promise<UploadResult> {
  const localUri = filePath.startsWith('file://') ? filePath : `file://${filePath}`;
  const finalUrl = `${uploadUrl}&fields=id,webViewLink,webContentLink`;

  const res = await FileSystem.uploadAsync(finalUrl, localUri, {
    httpMethod: 'PUT',
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: { 'Content-Type': mime },
  });

  let json: any = {};
  try {
    json = res.body ? JSON.parse(res.body) : {};
  } catch {
    json = {};
  }

  if (res.status < 200 || res.status >= 300 || !json.id) {
    console.error('PUT Drive error status/body:', res.status, res.body);
    throw new Error(json?.error || `Error subiendo a Drive (HTTP ${res.status})`);
  }

  return json as UploadResult;
}

export async function uploadFootModelToDrive(
  filePath: string,
  side: 'right' | 'left',
  opts: UploadOpts = {}
): Promise<UploadResult> {
  if (!filePath) throw new Error('Ruta de archivo vacía');

  const filename = `${Date.now()}-${side}-scan.usdz`;

  const uploadUrl = await requestUploadUrl(filename, 'model/vnd.usdz+zip', opts);
  const driveObj = await putWholeFileToGoogle(uploadUrl, filePath, 'model/vnd.usdz+zip');

  return driveObj;
}
