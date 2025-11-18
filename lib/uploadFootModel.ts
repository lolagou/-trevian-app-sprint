// lib/uploadFootModel.ts
import * as FileSystem from 'expo-file-system';
import { API_BASE, DEMO_UPLOAD } from './config';

type UploadResult = {
  id: string;
  webViewLink?: string;
  webContentLink?: string;
};

type UploadOpts = {
  jobId?: string;
  userName?: string;
  side?: 'right' | 'left';
};

/**
 * 1) Pedimos al backend la URL de subida resumable de Drive
 */
async function requestUploadUrl(
  filename: string,
  mime = 'model/vnd.usdz+zip',
  opts: UploadOpts = {}
): Promise<string> {
  // 👉 Esto sigue por si algún día querés usar DEMO solo para la parte PUT.
  if (DEMO_UPLOAD) {
    return 'https://fake-upload-url.googleapis.com/upload/drive/v3/files?uploadType=resumable';
  }

  const res = await fetch(`${API_BASE}/drive/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename,
      mime,
      jobId: opts.jobId,
      userName: opts.userName,
      side: opts.side,
    }),
  });

  const text = await res.text();
  console.log('🔍 /drive/init status:', res.status);
  console.log('🔍 /drive/init raw body:', text);

  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = {};
  }

  const uploadUrl =
    json.uploadUrl || json.uploadURL || json.url || json.location;

  if (!res.ok || !uploadUrl) {
    console.error('Error /drive/init JSON parseado:', json);
    throw new Error(json?.error || 'No se pudo obtener uploadUrl');
  }

  console.log('✅ uploadUrl recibida del back:', uploadUrl);
  return uploadUrl as string;
}

/**
 * 2) Hacemos el PUT con TODO el archivo al uploadUrl de Drive
 */
async function putWholeFileToGoogle(
  uploadUrl: string,
  filePath: string,
  mime = 'model/vnd.usdz+zip'
): Promise<UploadResult> {
  if (DEMO_UPLOAD) {
    console.log('🔁 DEMO: simulando subida a Drive...', { filePath, mime, uploadUrl });
    await new Promise((r) => setTimeout(r, 1500));
    return {
      id: `demo-${Date.now()}`,
      webViewLink: 'https://example.com/demo-view',
      webContentLink: 'https://example.com/demo-model.usdz',
    };
  }

  const localUri = filePath.startsWith('file://') ? filePath : `file://${filePath}`;

  const info = await FileSystem.getInfoAsync(localUri);
  console.log('📂 Info archivo local antes de subir:', info);

  if (!info.exists) {
    throw new Error(`El archivo local no existe: ${localUri}`);
  }
  if (!info.size || info.size === 0) {
    throw new Error(`El archivo local tiene tamaño 0 bytes: ${localUri}`);
  }

  console.log('⬆️ Subiendo a Drive (PUT):', uploadUrl);
  console.log('📏 Tamaño a subir (bytes):', info.size);

  const res = await FileSystem.uploadAsync(uploadUrl, localUri, {
    httpMethod: 'PUT',
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: {
      'Content-Type': mime,
      'Content-Length': String(info.size),
    },
  });

  console.log('📥 Respuesta PUT Drive: status=', res.status);
  console.log('📥 Respuesta PUT Drive body:', res.body);

  let json: any = {};
  try {
    json = res.body ? JSON.parse(res.body) : {};
  } catch {
    json = {};
  }

  if (res.status < 200 || res.status >= 300) {
    console.error('🚨 PUT Drive error status/body:', res.status, res.body);
    throw new Error(json?.error || `Error subiendo a Drive (HTTP ${res.status})`);
  }

  if (!json.id) {
    console.warn('⚠️ Subida OK pero sin id en la respuesta de Drive');
    return {
      id: 'unknown-id',
      webViewLink: undefined,
      webContentLink: undefined,
    };
  }

  return json as UploadResult;
}

/**
 * 3) Función principal que usás desde React Native
 */
export async function uploadFootModelToDrive(
  filePath: string,
  side: 'right' | 'left',
  opts: UploadOpts = {}
): Promise<UploadResult> {
  // 🧨 ACA CORTAMOS TODO SI ESTAMOS EN DEMO
  if (DEMO_UPLOAD) {
    console.log('🧪 DEMO_UPLOAD activo → simulando todo el flujo de subida');

    // Simulamos un pequeño delay para que parezca real
    await new Promise((r) => setTimeout(r, 1000));

    return {
      id: `demo-${Date.now()}`,
      webViewLink: 'https://example.com/demo-view',
      webContentLink: 'https://example.com/demo-model.usdz',
    };
  }

  // 👇 MODO REAL (no demo)
  if (!filePath) throw new Error('Ruta de archivo vacía');

  const filename = `${Date.now()}-${side}-scan.usdz`;
  console.log('🧾 Preparando subida de archivo:', { filePath, filename, side });

  const uploadUrl = await requestUploadUrl(filename, 'model/vnd.usdz+zip', {
    ...opts,
    side,
  });

  const driveObj = await putWholeFileToGoogle(uploadUrl, filePath, 'model/vnd.usdz+zip');
  console.log('✅ Subida completa. Objeto Drive:', driveObj);

  return driveObj;
}
