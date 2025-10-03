// app/upload.tsx  (o donde prefieras)
import React from 'react';
import { Button, Alert, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { createClient } from '@supabase/supabase-js';

// --- CONFIG SUPABASE ---
const supabaseUrl = 'https://peutxcbxleqabbtujbzf.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldXR4Y2J4bGVxYWJidHVqYnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNDExNDQsImV4cCI6MjA2NDkxNzE0NH0.-qTmXGLFk9hbbDA9yA0gE2Sh9JLKll4g-Ejp8K3KMsY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const BUCKET = 'models'; // tu bucket real

type Props = {
  userId?: string; // opcional: si no viene, sube a /public
};

export default function UploadUSDZ({ userId }: Props) {
  const pickAndUploadFile = async () => {
    try {
      // 1) Elegir archivo (lo copiamos a cache para poder leerlo)
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });

      const fileUri = res.fileCopyUri || res.uri;
      if (!fileUri) throw new Error('No se pudo resolver la ruta del archivo.');

      // 2) Leer como base64 y convertir a ArrayBuffer (RN no tiene Blob/File nativos)
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const arrayBuffer = decode(base64);

      // 3) Nombre único (en carpeta por usuario o en /public)
      const safeName = (res.name ?? 'model.usdz').replace(/\s+/g, '_');
      const folder = userId ? userId : 'public';
      const fileName = `${folder}/${Date.now()}-${safeName}`; // <-- ✅ con backticks

      // 4) Content-Type
      const isUSDZ = safeName.toLowerCase().endsWith('.usdz');
      const contentType = res.type || (isUSDZ ? 'model/vnd.usdz+zip' : 'application/octet-stream');

      // 5) Subir a Storage
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, arrayBuffer, { contentType, upsert: false });

      if (upErr) throw upErr;

      // 6) URL (si el bucket es público):
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      const url = pub?.publicUrl;

      Alert.alert('✅ Subida exitosa', url ?? 'Archivo subido. (Bucket privado)');
      console.log('Public URL:', url);
    } catch (err: any) {
      if (DocumentPicker.isCancel?.(err)) {
        console.log('Selección cancelada');
      } else {
        console.error('Error al subir:', err);
        Alert.alert('❌ Error', err?.message ?? 'No se pudo subir el archivo.');
      }
    }
  };

  return (
    <View style={{ padding: 24 }}>
      <Button title="Subir modelo 3D" onPress={pickAndUploadFile} />
    </View>
  );
}
