import html2canvas from "html2canvas";

export const takeFullScreenshot = async () => {
  try {
    const targetElement = document.documentElement;
    const canvas = await html2canvas(targetElement);
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Ekran görüntüsü alınamadı:", error);
    throw error;
  }
};
