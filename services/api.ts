import * as FileSystem from 'expo-file-system';

export const uploadModel = async (fileUri: string) => {
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (!fileInfo.exists) throw new Error('Archivo no encontrado');

  const formData = new FormData();
  formData.append('model', {
    uri: fileUri,
    name: 'model.usdz',
    type: 'model/vnd.usdz+zip',
  } as any);

  return fetch('https://tu-api/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
