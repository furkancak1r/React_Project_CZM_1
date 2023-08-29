import urls from "./apiUrls";
import translateConfig from "../../config";
import { v4 as uuidv4 } from "uuid";

export const fetchNavbarData = async () => {
  const table_names = "navbar";
  const columns = "title";

  try {
    const response = await fetch(urls[0], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ table_names, columns }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching Navbar data:", error);
  }
};

export const updateNavbarData = async (data) => {
  try {
    const response = await fetch(urls[1], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("Response from the server:", response);
    const textResponse = await response.text();
    console.log("Text response from the server:", textResponse);
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Error updating Navbar data:", error);
  }
};

export const sendAdminInfo = async (username, password) => {
  try {
    const response = await fetch(urls[2], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    console.log("Response from the server:", response);
    const textResponse = await response.text();
    console.log("Text response from the server:", textResponse);
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Error sending admin info:", error);
  }
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

export const fetchMaxColorVersion = async () => {
  const apiUrlForMaxColorVersion = urls[5];

  try {
    const response = await fetch(apiUrlForMaxColorVersion, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching max color version:", error);
    throw error;
  }
};
export const uploadAllColors = async (allColors) => {
  const apiUrlForUploadColor = urls[6];

  try {
    const maxColorVersion = await fetchMaxColorVersion();
    const newColorVersion = Number(maxColorVersion) + 1;

    const responsePromises = [];
    
    for (const location in allColors) {
      const color = allColors[location];
      const responsePromise = await fetch(apiUrlForUploadColor, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location, color, newColorVersion }),
      });

      responsePromises.push(responsePromise);
    }

    const responses = await Promise.all(responsePromises);
    const responseData = [];

    for (const response of responses) {
      try {
        const data = await response.json();
        responseData.push(data);
      } catch (error) {
        console.error("Error parsing response:", error);
      }
    }

    return responseData;
  } catch (error) {
    console.error("Error uploading colors:", error);
    throw error;
  }
};
