import axios from "axios";

export const UseMethods = async (
  method,
  url,
  payload = null,
  params = "",
  isMultipart = false,
  responseType = "json"
) => {
  try {
    // Get the token from localStorage
    const authToken = localStorage.getItem("api_token");

    // Log to ensure the token is retrieved
    console.log("API Token:", authToken);

    if (!authToken) {
      throw new Error("No token found in localStorage");
    }

    // Set headers for the request
    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    };

    let api = "http://127.0.0.1:8000/api/" + url;
    let response;

    switch (method.toLowerCase()) {
      case "get":
        response = await axios.get(`${api}/${params}`, { headers });
        break;
      case "post":
        response = await axios.post(api, payload, { headers });
        break;
      case "put":
        response = await axios.put(api, payload, { headers });
        break;
      case "delete":
        response = await axios.delete(api + params, { headers });
        break;
      default:
        throw new Error(`Invalid HTTP method: ${method}`);
    }

    // Check for successful response
    if (
      method.toLowerCase() === "post" &&
      ![200, 201].includes(response.status)
    ) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error(
      `Error with ${method.toUpperCase()} request to ${url}:`,
      error
    );
    return null;
  }
};
