import React, { useState } from 'react'
import { View, Text, Button, Alert, ActivityIndicator, Platform } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient ('https://peutxcbxleqabbtujbzf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldXR4Y2J4bGVxYWJidHVqYnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNDExNDQsImV4cCI6MjA2NDkxNzE0NH0.-qTmXGLFk9hbbDA9yA0gE2Sh9JLKll4g-Ejp8K3KMsY')

  export default function UploadUsdzInline() {
  const [url, setUrl] = useState<string | null>(null)
  const [path, setPath] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const pickAndUpload = async () => {
    try {
      setLoading(true)
      setUrl(null)
      setPath(null)

      // 1) Elegir archivo
      const file = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles], // si tu picker soporta mime, podés filtrar por usdz
        copyTo: 'cachesDirectory',
      })

      const name = (file.name ?? 'model.usdz').trim()
      if (!name.toLowerCase().endsWith('.usdz')) {
        throw new Error('Seleccioná un archivo con extensión .usdz')
      }

      // 2) Obtener una URI utilizable
      const uri = file.fileCopyUri ?? file.uri
      if (!uri) throw new Error('No se pudo acceder al archivo seleccionado')

      // 3) Leer como Blob (React Native permite fetch sobre file:// o content://)
      //    En Android, a veces necesitás "content://" y permisos; DocumentPicker ya maneja esto.
      const res = await fetch(uri)
      const blob = await res.blob()

      // 4) Path destino en Storage (carpeta "anon" por demo; con anon no hay seguridad por prefijo)
      const folder = 'anon'
      const ts = Date.now()
      const safeName = name.replace(/\s+/g, '_')
      const destPath = `${folder}/${ts}-${safeName}`

      // 5) Subir a Supabase Storage
      const { data, error } = await supabase.storage
        .from('models')            // 👈 bucket
        .upload(destPath, blob, {  // 👈 Blob directo (sin helpers)
          contentType: 'model/vnd.usdz+zip', // si hay problemas, probá 'application/octet-stream'
          upsert: false,
        })

      if (error) throw error

      setPath(destPath)

      // 6) URL pública (suponiendo bucket "Public" o policy SELECT to public)
      const { data: pub } = supabase.storage.from('models').getPublicUrl(destPath)
      setUrl(pub.publicUrl)

      Alert.alert('Listo ✅', `Archivo subido en: ${destPath}`)
    } catch (err: any) {
      console.log(err)
      Alert.alert('Error', err?.message ?? 'Falló la subida')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Button title="Subir .USDZ a Supabase" onPress={pickAndUpload} disabled={loading} />
      {loading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ActivityIndicator />
          <Text>Subiendo…</Text>
        </View>
      ) : null}
      {path ? <Text style={{ fontWeight: '600' }}>Path: {path}</Text> : null}
      {url ? (
        <Text selectable>
          URL pública: {url}
        </Text>
      ) : null}
      <Text style={{ opacity: 0.7, fontSize: 12 }}>
        {Platform.OS === 'android'
          ? 'Nota Android: si ves error con content://, asegurate de usar fileCopyUri y habilitar permisos de archivos.'
          : 'Nota iOS: probalo en dispositivo físico; el simulador puede tener limitaciones con archivos grandes.'}
      </Text>
    </View>
  )
}
