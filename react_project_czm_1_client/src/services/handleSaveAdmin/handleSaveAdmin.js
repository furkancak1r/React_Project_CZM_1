import { takeFullScreenshot } from "../screenshot/screenshot";
import { dataURLtoFile } from "../dataURLtoFile/dataURLtoFile";
import { updateNavbarData } from "../api-services/apiServices";
import { uploadFile } from "../uploadFile/uploadFile";

export const handleSaveAdminFn = async (
  navbarData,
  uploadedLogoFile,
  fetchDataAndSetState
) => {
  const filteredData = navbarData.filter((item) => item.title.trim() !== "");

  if (filteredData.length === 0) {
    console.log("filteredData.length:", filteredData.length);
  } else {
    const data = {
      table_names: ["navbar"],
      columns: ["title"],
      values: filteredData.map((item) => item.title),
    };
    updateNavbarData(data).then(() => {
      fetchDataAndSetState();
    });
  }

  if (uploadedLogoFile) {
    await uploadFile(uploadedLogoFile, "logo");
  }

  try {
    const screenshot = await takeFullScreenshot();
    const screenshotFile = dataURLtoFile(screenshot, "screenshot.png");
    await uploadFile(screenshotFile, "screenshots");
  } catch (error) {
    console.error("Ekran görüntüsü alınırken hata oluştu:", error);
  }
};
