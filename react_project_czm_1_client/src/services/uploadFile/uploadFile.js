import { fetchUploadFile } from "../api-services/apiServices";
export const uploadFile = async (file, location,savedVersion) => {
  if (!file) {
    return;
  }

  try {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const fileBase64 = fileReader.result.split(",")[1];
      await fetchUploadFile(file.name, file.type, location, fileBase64,savedVersion);
    };

    fileReader.readAsDataURL(file);
  } catch (error) {
    console.error("Dosya yüklenirken bir hata oluştu:", error);
  }
};
