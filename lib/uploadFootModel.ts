// lib/uploadFootModel.ts
import RNFS from 'react-native-fs';
import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';

// polyfill Buffer en RN
// @ts-ignore
(global as any).Buffer = (global as any).Buffer || Buffer;

const supabase = createClient(
  'https://peutxcbxleqabbtujbzf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldXR4Y2J4bGVxYWJidHVqYnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNDExNDQsImV4cCI6MjA2NDkxNzE0NH0.-qTmXGLFk9hbbDA9yA0gE2Sh9JLKll4g-Ejp8K3KMsY',
  { auth: { persistSession: false } }
);

export async function uploadFootModel(
  filePath: string,
  side: 'right' | 'left'
): Promise<{ publicUrl: string; storagePath: string }> {
  // filePath viene de ObjectCaptureModule (normalmente "file://...")
  let readPath = filePath.replace('file://', '');
  if (!readPath) throw new Error('Ruta de archivo vacía');

  const base64 = await RNFS.readFile(readPath, 'base64');
  const buf = Buffer.from(base64, 'base64');
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const size = (ab as ArrayBuffer).byteLength;
  if (!size) throw new Error('El archivo tiene 0 bytes');

  const destPath = `feet/${side}/${Date.now()}-scan.usdz`;

  const { error } = await supabase.storage.from('models').upload(destPath, ab, {
    contentType: 'model/vnd.usdz+zip',
    upsert: false,
    // @ts-ignore
    duplex: 'half',
  });

  if (error) throw error;

  const { data: pub } = supabase.storage.from('models').getPublicUrl(destPath);

  return { publicUrl: pub.publicUrl, storagePath: destPath };
}
