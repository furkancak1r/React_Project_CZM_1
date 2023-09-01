import { takeFullScreenshot } from "../screenshot/screenshot";
import { dataURLtoFile } from "../dataURLtoFile/dataURLtoFile";
import { updateNavbarData, uploadAllColors } from "../api-services/apiServices";
import { uploadFile } from "../uploadFile/uploadFile";
import { fetchMaxSavedVersion } from "../api-services/apiServices";
import { fetchUploadFile } from "../api-services/apiServices";

export const handleSaveAdminFn = async (
  navbarData,
  uploadedLogoFile,
  fetchDataAndSetState,
  allColors,
  latestFileInfoForLogo
) => {
  try {
    const maxSavedVersion = await fetchMaxSavedVersion("navbar");
    const newMaxSavedVersion = Number(maxSavedVersion) + 1;

    const filteredData = navbarData.filter((item) => item.title.trim() !== "");
    if (filteredData.length > 0) {
      const data = {
        values: filteredData.map((item) => item.title),
        savedVersion: newMaxSavedVersion,
      };
      await updateNavbarData(data);
    }
    if (uploadedLogoFile) {
      await uploadFile(uploadedLogoFile, "logo", newMaxSavedVersion);
    } else if (latestFileInfoForLogo) {
      await fetchUploadFile(
        latestFileInfoForLogo.fileName,
        latestFileInfoForLogo.fileExtension,
        latestFileInfoForLogo.location,
        latestFileInfoForLogo.fileBase64,
        newMaxSavedVersion
      );
    }

    const screenshot = await takeFullScreenshot();
    const screenshotFile = dataURLtoFile(screenshot, "screenshot.png");
    await uploadFile(screenshotFile, "screenshots", newMaxSavedVersion);
    await uploadAllColors(allColors, newMaxSavedVersion);
    await fetchDataAndSetState();
  } catch (error) {
    return "Hata";
  }
};
