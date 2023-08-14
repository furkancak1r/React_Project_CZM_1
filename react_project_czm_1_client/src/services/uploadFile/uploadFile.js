import {fetchUploadFile} from "../api-services/apiServices"
export const uploadFile = async (e) => {
  const file = e.target.files[0];

  if (!file) {
    return;
  }

  try {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const fileBase64 = fileReader.result.split(",")[1];

      // Dosyayı base64'e çevirip sunucuya yükle
      await fetchUploadFile(file.name, file.type, fileBase64);

    };

    fileReader.readAsDataURL(file);
  } catch (error) {
    console.error("Dosya yüklenirken bir hata oluştu:", error);
  }
};
