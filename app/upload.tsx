import React from "react";
import { Button, Alert } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { createClient } from "@supabase/supabase-js";

// 🔑 Tus credenciales de Supabase
const supabaseUrl = "https://YOUR_PROJECT.supabase.co";
const supabaseAnonKey = "YOUR_ANON_KEY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UploadUSDZ() {
  const pickAndUploadFile = async () => {
    try {
      // 1. Seleccionar archivo
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        copyTo: "cachesDirectory",
      });

      console.log("Archivo seleccionado:", res);

      // 2. Obtener blob
      const fileUri = res.fileCopyUri || res.uri;
      const response = await fetch(fileUri);
      const fileBlob = await response.blob();

      // 3. Nombre único
      const fileName = `models/${Date.now()}-${res.name}`;

      // 4. Subir a Supabase
      const { data, error } = await supabase.storage
        .from("usdz-files")
        .upload(fileName, fileBlob, {
          contentType: res.type || "model/vnd.usdz+zip",
          upsert: false,
        });

      if (error) throw error;

      // 5. URL pública
      const { data: publicUrlData } = supabase.storage
        .from("usdz-files")
        .getPublicUrl(fileName);

      Alert.alert("✅ Subida exitosa", publicUrlData.publicUrl);
      console.log("Archivo subido en:", publicUrlData.publicUrl);
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log("Selección cancelada");
      } else {
        console.error("Error al subir:", err.message);
        Alert.alert("❌ Error", err.message);
      }
    }
  };

  return <Button title="Subir archivo USDZ" onPress={pickAndUploadFile} />;
}
