import React from "react";

export default class GithubAuthError extends React.Component {
  constructor(props: any) {
    super(props);
    this.props = props || {};
  }
  props: any = {
    github_auth: null,
  };
  render() {
    return (
      <div className="flex flex-col justify-center items-center mt-20">
        <h2
          className="text-2xl font-black
          uppercase tracking-widest text-slate-900"
        >
          {this.props.github_auth.error()}
        </h2>
        <p className="text-xl text-slate-900">
          {this.props.github_auth.errorDescription()}
        </p>
        <div className="flex flex-row">
          <a
            href="/"
            className="text-white py-2 px-6 m-4 bg-slate-900 rounded-full hover:bg-white hover:text-slate-900 hover:shadow-lg"
          >
            Try again
          </a>
          <a
            href={this.props.github_auth.errorUri() || "#"}
            className="text-white py-2 px-6 m-4 bg-slate-900 rounded-full hover:bg-white hover:text-slate-900 hover:shadow-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Error URI
          </a>
        </div>
      </div>
    );
  }
}
