import React from "react";
// @ts-ignore
import GitHubLogin from "react-github-login";
import env from "../lib/environments/env.prod";

export default class GithubLogin extends React.Component {
  render() {
    const onSuccess = (response: any) => console.log(response);
    const onFailure = (response: any) => console.error(response);

    return (
      <GitHubLogin
        clientId={env.github_client_id}
        redirectUri={env.github_redirect_uri}
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    );
  }
}
