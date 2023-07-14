import React from "react";

export default class Upload extends React.Component {
  constructor(props: any) {
    super(props);
    this.props = props || {};
  }
  props: any = {
    data: {
      access_token: null,
      refresh_token: null,
      expires_at: null,
      refresh_token_expires_at: null,
    },
  };
  state: any = {
    status: "",
    component_name: "",
    component_content: "",
  };

  // Upload the component
  private readonly uploadComponent = (): void => {
    if (!this.state.component_name || !this.state.component_content) {
      this.setState({ status: "Component Name or Content is Empty" });
      return;
    }
    this.setState({ status: "Uploading Component" });

    fetch(
      `https://api.github.com/repos/realTristan/tailwindcomponents/contents/tailwindcomponents/${this.state.component_name}/.html`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.props.data.access_token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          message: "Upload Component",
          content: btoa(this.state.component_content),
        }),
      }
    )
      .then((res) => res.status)
      .then((status) => {
        if (status === 201) {
          this.setState({ status: "Component Uploaded" });
        } else {
          this.setState({ status: "Component Upload Failed" });
        }
      });
  };

  // Render the component
  render() {
    return (
      <div>
        <div className="flex flex-row justify-center items-center space-x-3">
          <button
            onClick={() => this.uploadComponent()}
            className="text-slate-900 w-auto h-auto p-3 border-2 ring-2 ring-slate-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none hover:bg-slate-900 hover:text-white"
          >
            Upload
          </button>
          <input
            onChange={(e) => this.setState({ component_name: e.target.value })}
            type="text"
            id="component-name"
            placeholder="Component Name"
            className="text-slate-900 p-3 m-3 border-2 ring-2 ring-slate-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
        <p className="text-slate-900 text-center font-semibold">
          {this.state.status}
        </p>
        <textarea
          onChange={(e) => this.setState({ component_content: e.target.value })}
          id="component-content"
          placeholder="Component Content"
          className="text-slate-900 w-96 h-96 p-3 m-3 border-2 ring-2 ring-slate-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
      </div>
    );
  }
}
