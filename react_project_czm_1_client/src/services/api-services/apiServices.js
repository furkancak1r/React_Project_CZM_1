import urls from "./apiUrls";
import translateConfig from "../../config";
import { v4 as uuidv4 } from "uuid";

// navbarService.js

export const fetchNavbarData = () => {
  // Table and column information to be sent in the request body
  const table_names = "navbar";
  const columns = "title";

  // Make the POST request to fetch the Navbar data from the server
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
      return response.text(); // Change to response.text() for debugging
    })
    .then((textResponse) => {
      console.log("Text response from the server:", textResponse); // Log the text response
      return JSON.parse(textResponse); // Try parsing the text response as JSON
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
    body: JSON.stringify({ username, password }), // Verileri JSON olarak göndermek
  })
    .then((response) => {
      console.log("Response from the server:", response);
      return response.text(); // Hata ayıklama için response.text() olarak dönebilirsiniz
    })
    .then((textResponse) => {
      console.log("Text response from the server:", textResponse); // Text cevabını logla
      return JSON.parse(textResponse); // Text cevabını JSON olarak çözümle
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

export const fetchUploadFile = async (fileName, fileExtention, location,fileBase64) => {
  const apiUrl = urls[3]; 

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName, fileExtention, location,fileBase64 }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};