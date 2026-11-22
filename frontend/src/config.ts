// Base URL for the banking backend.
//
// In development, leave REACT_APP_API_URL unset so requests use relative paths
// and go through the CRA dev-server proxy configured in package.json
// ("proxy": "http://localhost:8080"). That avoids CORS entirely.
//
// For a deployed build, set REACT_APP_API_URL (e.g. the Render URL) and rebuild.
export const API_BASE_URL = process.env.REACT_APP_API_URL ?? "";
