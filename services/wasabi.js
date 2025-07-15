import * as FileSystem from 'expo-file-system';
import { apiMultipart } from '../api/api';

const endpoint = '/api/upload';
//const folder = 'productos';
export const uploadImageToWasabi = async (uri, folder) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error("El archivo no existe en la ruta especificada");
    }

    const fileName = uri.split('/').pop() || 'img.jpg';
    const match = /\.(\w+)$/.exec(fileName);
    const type = match ? `image/${match[1]}` : `image`;

    const folderName = folder || 'productos'; // fallback

    console.log("==> Subiendo imagen a Wasabi:");
    console.log("- Archivo:", fileName);
    console.log("- Tipo:", type);
    console.log("- Carpeta:", folderName);

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: fileName,
      type,
    });
    formData.append('fileName', fileName);
    formData.append('folder', folderName);
    const response = await apiMultipart.post(endpoint, formData);
    /* const response = await fetch('http://192.168.0.14:8080/api/upload-to-wasabi', {
      method: 'POST',
      body: formData,
    }); 

    if (!response.ok) {
      const text = await response.text();
      console.error("Respuesta del backend:", text);
      throw new Error("Error al subir la imagen");
    }

    const data = await response.json();
    return data.fileUrl;*/
    return response.data.fileUrl;
  } catch (error) {
    console.error("Error al subir imagen a Wasabi:", error);
    throw error;
  }
};


export const uploadVideoToWasabi = async (uri, folder) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error("El archivo no existe en la ruta especificada");
    }

    const fileName = uri.split('/').pop() || 'video.mp4';
    const match = /\.(\w+)$/.exec(fileName);
    // Ajustamos el tipo MIME para video, por si acaso el backend necesita algo específico
    const videoTypes = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'mpeg'];
    const ext = match ? match[1].toLowerCase() : '';
    //const type = videoTypes.includes(ext) ? `video/${ext}` : 'video/mp4';
    const type = ext === 'mov' ? 'video/quicktime' : videoTypes.includes(ext) ? `video/${ext}` : 'video/mp4';

    const folderName = folder || 'productos'; // fallback para videos

    console.log("🎥 Subiendo video a Wasabi:");
    console.log("- Archivo:", fileName);
    console.log("- Tipo:", type);
    console.log("- Carpeta:", folderName);

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: fileName,
      type,
    });
    formData.append('fileName', fileName);
    formData.append('folder', folderName);
    console.log("Datos del formulario:", formData);
    // Aquí usamos apiMultipart para enviar el video
    

    const response = await apiMultipart.post(endpoint, formData);
/* const response = await fetch('http://192.168.0.14:8080/api/upload-to-wasabi', {
      method: 'POST',
      body: formData,
    }); 

    if (!response.ok) {
      const text = await response.text();
      console.error("Respuesta del backend:", text);
      throw new Error("Error al subir la imagen");
    }

    const data = await response.json();
    return data.fileUrl;*/
    return response.data.fileUrl;
  } catch (error) {
    console.error("Error al subir video a Wasabi:", error);
    throw error;
  }
};
