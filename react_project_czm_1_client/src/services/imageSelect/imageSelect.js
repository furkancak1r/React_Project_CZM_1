export const handleDoubleClickedFn = () => {
    return new Promise((resolve, reject) => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.click();
      fileInput.addEventListener("change", () => {
        const selectedFile = fileInput.files[0];
        if (selectedFile) {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const uploadedLogoSrc = fileReader.result;
            resolve({
              uploadedLogoFile: selectedFile,
              uploadedLogoSrc: uploadedLogoSrc,
            });
          };
          fileReader.readAsDataURL(selectedFile);
        } else {
          reject(new Error("No file selected"));
        }
      });
    });
  };
  