// NextJS Server
// https://nextjs.org/docs/api-routes/introduction

// Github API Variables
const GITHUB_API_URL: string = "https://github.com/login/oauth/access_token";
const CLIENT_SECRET: string = process.env.GITHUB_CLIENT_SECRET;

// Get the code from the request body
function getCode(req: any, res: any): string | null {
  const code: string | null = req.body.code;
  if (!code) {
    res.status(400).json({ message: "Code not present in body" });
    return null;
  }
  return code;
}

// Get the client ID from the request body
function getClientId(req: any, res: any): string | null {
  const clientId: string | null = req.body.client_id;
  if (!clientId) {
    res.status(400).json({ message: "Client ID not present in body" });
    return null;
  }
  return clientId;
}

// Get the redirect URI from the request body
function getRedirectUri(req: any, res: any): string | null {
  const redirectUri: string | null = req.body.redirect_uri;
  if (!redirectUri) {
    res.status(400).json({ message: "Redirect URI not present in body" });
    return null;
  }
  return redirectUri;
}

// Send a POST request to the Github API
function fetchAccessToken(code: string, clientId: string, redirectUri: string) {
  return fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      client_id: clientId,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: redirectUri,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      return {
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: redirectUri,
        access_token: json.access_token,
      };
    });
}

// Endpoint handler
export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  // Get the code from the request body
  const code: string | null = getCode(req, res);
  if (!code) return;

  // Get the client ID from the request body
  const clientId: string | null = getClientId(req, res);
  if (!clientId) return;

  // Get the redirect URI from the request body
  const redirectUri: string | null = getRedirectUri(req, res);
  if (!redirectUri) return;

  // Send a POST request to the Github API
  const resp: any = fetchAccessToken(code, clientId, redirectUri);

  // Return the access token
  res.status(200).json(resp);
}
