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
    const authToken = localStorage.getItem("api_token");
    if (!authToken) throw new Error("No token found in localStorage");

    // Set headers
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    // For non-multipart requests, set JSON content-type
    if (!isMultipart) {
      headers["Content-Type"] = "application/json";
    }

    const api = `http://127.0.0.1:8000/api/${url}`;
    let response;

    switch (method.toLowerCase()) {
      case "get":
        response = await axios.get(`${api}/${params}`, { headers, responseType });
        break;

      case "post":
        response = await axios.post(api, payload, {
          headers,
          responseType,
        });
        break;

      case "put":
        response = await axios.put(api, payload, {
          headers,
          responseType,
        });
        break;

      case "delete":
        response = await axios.delete(`${api}/${params}`, {
          headers,
          responseType,
        });
        break;

      default:
        throw new Error(`Invalid HTTP method: ${method}`);
    }

    return response;
  } catch (error) {
    console.error(`Error with ${method.toUpperCase()} request to ${url}:`, error);
    return null;
  }
};
