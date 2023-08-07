import urls from "./ApiUrls";

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
  // Make the POST request to update the Navbar data on the server
  return fetch(urls[1], {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error updating Navbar data:", error);
    });
};
