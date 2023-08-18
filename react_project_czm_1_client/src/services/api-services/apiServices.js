import urls from "./apiUrls";
import translateConfig from "../../config";
import { v4 as uuidv4 } from "uuid";

export const fetchNavbarData = () => {
  const table_names = "navbar";
  const columns = "title";

  return fetch(urls[0], {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ table_names, columns }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching Navbar data:", error);
    });
};

export const updateNavbarData = (data) => {
  return fetch(urls[1], {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log("Response from the server:", response);
      return response.text();
    })
    .then((textResponse) => {
      console.log("Text response from the server:", textResponse);
      return JSON.parse(textResponse);
    })
    .catch((error) => {
      console.error("Error updating Navbar data:", error);
    });
};

export const sendAdminInfo = (username, password) => {
  return fetch(urls[2], {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      console.log("Response from the server:", response);
      return response.text();
    })
    .then((textResponse) => {
      console.log("Text response from the server:", textResponse);
      return JSON.parse(textResponse);
    })
    .catch((error) => {
      console.error("Error sending admin info:", error);
    });
};

export const translateService = async (text, targetLanguage) => {
  const key = translateConfig.key;
  const endpoint = translateConfig.endpoint;
  const location = translateConfig.location;

  const apiUrl = `${endpoint}/translate?api-version=3.0&from=en&to=${targetLanguage}`;
  const requestData = [
    {
      text: text,
    },
  ];

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": location,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    return data[0].translations[0].text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

export const fetchUploadFile = async (
  fileName,
  fileExtention,
  location,
  fileBase64
) => {
  const apiUrl = urls[3];

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName, fileExtention, location, fileBase64 }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const fetchLatestFileVersions = async (location, count) => {
  const apiUrl = urls[4];

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ location, count }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching latest file versions:", error);
    throw error;
  }
};
