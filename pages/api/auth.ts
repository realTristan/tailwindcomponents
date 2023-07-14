// NextJS Server
// https://nextjs.org/docs/api-routes/introduction

// Github API Variables
const GITHUB_API_URL: string = "https://github.com/login/oauth/access_token";
const CLIENT_SECRET: string = process.env.GITHUB_CLIENT_SECRET;

// Get the code from the request headers
function getCode(req: any, res: any): string | null {
  const code: string | null = req.headers.code;
  if (!code) {
    res.status(400).json({ message: "Code not present in headers" });
    return null;
  }
  return code;
}

// Get the client ID from the request headers
function getClientId(req: any, res: any): string | null {
  const clientId: string | null = req.headers.client_id;
  if (!clientId) {
    res.status(400).json({ message: "Client ID not present in headers" });
    return null;
  }
  return clientId;
}

// Get the redirect URI from the request headers
function getRedirectUri(req: any, res: any): string | null {
  const redirectUri: string | null = req.headers.redirect_uri;
  if (!redirectUri) {
    res.status(400).json({ message: "Redirect URI not present in headers" });
    return null;
  }
  return redirectUri;
}

// Send a POST request to the Github API
function getAccessToken(code: string, clientId: string, redirectUri: string) {
  // Set the request body
  const body: string = JSON.stringify({
    client_id: clientId,
    client_secret: CLIENT_SECRET,
    code: code,
    redirect_uri: redirectUri,
  });

  // Set the headers
  const headers: any = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  
  // Send a POST request to the Github API
  const response: any = fetch(GITHUB_API_URL, {
    method: "POST",
    headers: headers,
    body: body,
  })
    .then((res) => res.json())
    .then((json) => json.access_token);

  // Return the response from Github
  return response;
}

// Endpoint handler
export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  // Get the code from the request headers
  const code: string | null = getCode(req, res);
  if (!code) return;

  // Get the client ID from the request headers
  const clientId: string | null = getClientId(req, res);
  if (!clientId) return;

  // Get the redirect URI from the request headers
  const redirectUri: string | null = getRedirectUri(req, res);
  if (!redirectUri) return;

  // Send a POST request to the Github API
  const accessToken: string = getAccessToken(code, clientId, redirectUri);

  // Return the access token
  res.status(200).json({ access_token: accessToken });
}
