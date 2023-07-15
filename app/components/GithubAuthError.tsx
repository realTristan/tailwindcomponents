import React from "react";

export default class GithubAuthError extends React.Component {
  constructor(props: any) {
    super(props);
    this.props = props || {};
  }
  props: any = {
    error: null,
  };

  // Render the component
  render = () => (
    <div className="flex flex-col justify-center items-center mt-20">
      <h2 className="text-4xl font-black tracking-widest text-slate-900">
        {this.props.error.message}
      </h2>
      <p className="text-md text-slate-900 mt-3">
        {this.props.error.description}
      </p>
      <div className="flex flex-row mt-6 space-x-4">
        <a
          href="/"
          className="mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200"
        >
          Try again
        </a>
        <a
          href={this.props.error.uri || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200"
        >
          Visit Error URI
        </a>
      </div>
    </div>
  );
}
