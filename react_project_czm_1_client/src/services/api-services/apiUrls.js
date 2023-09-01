const localhost = "http://localhost:8080";

const urls = [
  `${localhost}/sqldata/selectRowsWithLatestTitleVersion`,
  `${localhost}/sqldata/insertrow`,
  `${localhost}/api/adminLogin`,
  `${localhost}/sqldata/uploadFile`,
  `${localhost}/sqldata/getLatestFileVersionsByLocation`,
  `${localhost}/sqldata/fetchMaxColorVersion`,
  `${localhost}/sqldata/uploadColor`,
  `${localhost}/sqldata/selectRowsWithLatestColorVersion`,
  `${localhost}/sqldata/selectMaxSavedVersion`,
  `${localhost}/sqldata/selectTableBySavedVersion`,
];

export default urls;
