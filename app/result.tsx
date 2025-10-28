import React, { useState } from 'react'
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs'
import { createClient } from '@supabase/supabase-js'
import { Buffer } from 'buffer'

// Polyfill por si hace falta
// @ts-ignore
global.Buffer = global.Buffer || Buffer

const supabase = createClient('https://peutxcbxleqabbtujbzf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldXR4Y2J4bGVxYWJidHVqYnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNDExNDQsImV4cCI6MjA2NDkxNzE0NH0.-qTmXGLFk9hbbDA9yA0gE2Sh9JLKll4g-Ejp8K3KMsY', {
  auth: { persistSession: false },
})

export default function UploadUsdz_ArrayBuffer() {
  const [url, setUrl] = useState<string | null>(null)
  const [path, setPath] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const pickAndUpload = async () => {
    try {
      setLoading(true)
      setUrl(null)
      setPath(null)

      const file = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      })

      const name = (file.name ?? 'model.usdz').trim()
      if (!name.toLowerCase().endsWith('.usdz')) throw new Error('Seleccioná un .usdz')

      // resolver ruta legible
      let readPath = file.fileCopyUri ?? file.uri
      if (!readPath) throw new Error('No se pudo acceder al archivo')
      if (readPath.startsWith('content://')) {
        // @ts-ignore
        if (file.path) readPath = file.path
        else throw new Error('Ruta content:// no legible; usá fileCopyUri con copyTo:cachesDirectory')
      }
      readPath = readPath.replace('file://', '')

      // leer como base64 y convertir a ArrayBuffer binario
      const base64 = await RNFS.readFile(readPath, 'base64')
      const buf = Buffer.from(base64, 'base64')
      const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) // ArrayBuffer real
      const size = (ab as ArrayBuffer).byteLength
      if (!size) throw new Error('El ArrayBuffer tiene 0 bytes')

      const destPath = `anon/${Date.now()}-${name.replace(/\s+/g, '_')}`
      // 👇 pasamos el ArrayBuffer directo (no Blob, no string)
      const { error } = await supabase.storage
        .from('models')
        .upload(destPath, ab, {
          contentType: 'model/vnd.usdz+zip', // o 'application/octet-stream'
          upsert: false,
          // @ts-ignore (algunos entornos RN requieren esto en fetch subyacente)
          duplex: 'half',
        })

      if (error) throw error

      setPath(destPath)
      const { data: pub } = supabase.storage.from('models').getPublicUrl(destPath)
      setUrl(pub.publicUrl)
      Alert.alert('✅ Subido como binario', `${(size / 1024).toFixed(1)} KB`)
    } catch (e: any) {
      console.log(e)
      Alert.alert('Error', e?.message ?? 'Falló la subida')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Button title="Subir .USDZ binario" onPress={pickAndUpload} disabled={loading} />
      {loading && (<><ActivityIndicator /><Text>Subiendo…</Text></>)}
      {path && <Text>Path: {path}</Text>}
      {url && <Text selectable>URL: {url}</Text>}
      <Text style={{ opacity: 0.7, fontSize: 12 }}>
        Esta versión guarda bytes reales (no texto base64). Abrí el archivo y ya debería mostrarse.
      </Text>
    </View>
  )
}