// NextJS Server
// https://nextjs.org/docs/api-routes/introduction

// Github API Variables
const GITHUB_API_URL: string = "https://github.com/login/oauth/access_token";
const CLIENT_SECRET: string | undefined = process.env.GITHUB_CLIENT_SECRET;

// Handle the response from the Github API
const handleJson = (json: any) => {
  if (json.error) return { json: json, status: 500 };
  return { json: json, status: 200 };
}

// Send a POST request to the Github API
const fetchAccessToken = async (code: string, clientId: string, redirectUri: string) => {
  return fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: redirectUri,
    }),
  })
    .then((res) => res.json())
    .then((json) => handleJson(json))
    .catch((error) => {
      return { json: { error: error }, status: 500 };
    });
}

// Endpoint handler
export default function handler(req: any, res: any) {
  // Check if the request method is POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // Get the code from the request body
  const code: string | null = req.body.code;
  if (!code) {
    res.status(400).json({ error: "Invalid Code" });
    return;
  }

  // Get the client ID from the request body
  const clientId: string | null = req.body.client_id;
  if (!clientId) {
    res.status(400).json({ error: "Invalid Client ID" });
    return;
  }

  // Get the redirect URI from the request body
  const redirectUri: string | null = req.body.redirect_uri;
  if (!redirectUri) {
    res.status(400).json({ error: "Invalid Redirect URI" });
    return;
  }

  // Send a POST request to the Github API
  fetchAccessToken(code, clientId, redirectUri).then((resp) =>
    res.status(resp.status).json(resp.json)
  );
}
