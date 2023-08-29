import { takeFullScreenshot } from "../screenshot/screenshot";
import { dataURLtoFile } from "../dataURLtoFile/dataURLtoFile";
import { updateNavbarData, uploadAllColors } from "../api-services/apiServices";
import { uploadFile } from "../uploadFile/uploadFile";

export const handleSaveAdminFn = async (
  navbarData,
  uploadedLogoFile,
  fetchDataAndSetState,
  allColors
) => {
  try {
    const filteredData = navbarData.filter((item) => item.title.trim() !== "");

    if (filteredData.length === 0) {
      console.log("filteredData.length:", filteredData.length);
    } else {
      const data = {
        table_names: ["navbar"],
        columns: ["title"],
        values: filteredData.map((item) => item.title),
      };
      await updateNavbarData(data);
    }

    if (uploadedLogoFile) {
      await uploadFile(uploadedLogoFile, "logo");
    }

    const screenshot = await takeFullScreenshot();
    const screenshotFile = dataURLtoFile(screenshot, "screenshot.png");
    await uploadFile(screenshotFile, "screenshots");
    await uploadAllColors(allColors);
    await fetchDataAndSetState();
  } catch (error) {
    return "Hata";
  }
};
