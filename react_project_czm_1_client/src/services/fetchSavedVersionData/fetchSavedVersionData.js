import { selectTableBySavedVersion } from "../api-services/apiServices";

const fetchSavedVersionData = async (selectedSavedVersionParam) => {
  const fetchedNavbarDataBySavedVersion = await selectTableBySavedVersion(
    "navbar",
    selectedSavedVersionParam
  );
  const fetchedFilesDataBySavedVersion = await selectTableBySavedVersion(
    "files",
    selectedSavedVersionParam
  );
  const fetchedColorsDataBySavedVersion = await selectTableBySavedVersion(
    "colors",
    selectedSavedVersionParam
  );

  return {
    fetchedNavbarDataBySavedVersion,
    fetchedFilesDataBySavedVersion,
    fetchedColorsDataBySavedVersion,
  };
};

export default fetchSavedVersionData;
