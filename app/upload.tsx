import React from "react";
import { Button, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import "react-native-url-polyfill/auto";      // <- necesario para supabase-js en RN
import { decode } from "base64-arraybuffer";
import { createClient } from "@supabase/supabase-js";

// ⚠️ PONÉ TUS CREDENCIALES
const supabaseUrl = "https://TU_PROYECTO.supabase.co";
const supabaseAnonKey = "TU_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UploadUSDZ() {
  const pickAndUploadFile = async () => {
    try {
      // 1) Elegir archivo (API de Expo)
      const result = await DocumentPicker.getDocumentAsync({
        type: ["model/vnd.usdz+zip", "image/*", "application/pdf", "*/*"],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) throw new Error("No se seleccionó archivo");

      // 2) Leer archivo a ArrayBuffer (RN no tiene Blob por defecto)
      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const arrayBuffer = decode(base64);

      // 3) Nombre + content-type
      const fileName = `models/${Date.now()}-${asset.name ?? "archivo.usdz"}`;
      const contentType = asset.mimeType ?? "application/octet-stream";

      // 4) Subir a Supabase Storage
      const { error } = await supabase.storage
        .from("usdz-files")              // <- tu bucket
        .upload(fileName, arrayBuffer, {
          contentType,
          upsert: false,
        });
      if (error) throw error;

      // 5) URL pública
      const { data: publicData } = supabase.storage
        .from("usdz-files")
        .getPublicUrl(fileName);

      Alert.alert("✅ Subida exitosa", publicData.publicUrl);
      console.log("URL:", publicData.publicUrl);
    } catch (err: any) {
      console.error(err);
      Alert.alert("❌ Error", err?.message ?? "No se pudo subir el archivo");
    }
  };

  return <Button title="Subir archivo USDZ" onPress={pickAndUploadFile} />;
}
